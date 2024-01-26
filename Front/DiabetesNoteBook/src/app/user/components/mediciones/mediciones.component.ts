import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { IUserLoginResponse } from 'src/app/interfaces/loginResponse.interface';
import {
  IMedicionesAzucar,
  Regimen,
} from 'src/app/interfaces/mediciones.interface';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MedicionesService } from 'src/app/services/mediciones.service';

@Component({
  selector: 'app-mediciones',
  templateUrl: './mediciones.component.html',
  styleUrls: ['./mediciones.component.css'],
})
export class MedicionesComponent {
  
  deporteRealizado: boolean = false;
  momentoGlucemiaAntes: boolean = true;
  mediciones: IMedicionesAzucar[] = [];
  mostrarModal: boolean = false;
  mensajeModal: string = '';
  


  nuevaMedicion: IMedicionesAzucar = {
    fecha: new Date(),
    regimen: Regimen.Desayuno,
    preMedicion: 0,
    postMedicion: 0,
    glucemiaCapilar: 0,
    bolusComida: 0,
    bolusCorrector: 0,
    preDeporte: 0,
    duranteDeporte: 0,
    postDeporte: 0,
    notas: '',
    idPersona: this.authService.userValue!.idPersona,
  };

  chartOption: EChartsOption = {};
  elementoPagina: any[] = [];
  paginaActual: number = 1;
  numeroTotalDePaginas: number = 0;
  elementosPorPagina: number = 4;

  constructor(private medicionesService: MedicionesService, private authService: AuthServiceService) {
    //Poner aqui cualquier cosa hace que se ejecute al inicio, a diferencia de ngOnInit que se ejecuta cuando se carga la vista
    
    this.chartOption = {};
  }

  ngOnInit() {
    this.prepararDatosGrafico();
    this.getMediciones(this.authService.userValue!.id);
    
  }

  calcularTotalDePaginas() {
    this.numeroTotalDePaginas = Math.ceil(this.mediciones.length / this.elementosPorPagina);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.numeroTotalDePaginas) {
      this.paginaActual = nuevaPagina;
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
      const fin = inicio + this.elementosPorPagina;
      this.elementoPagina = this.mediciones.slice(inicio, fin);
    }
  }

  abrirNotasModal(medicion: IMedicionesAzucar) {
    if (medicion.notas == '') {
      console.log('No hay notas para mostrar');
    } else {
      this.mostrarModal = true;
      this.mensajeModal = medicion.notas;
    }
  }

  prepararDatosGrafico() {
    const fechas = this.mediciones.map((m) => {
      const fecha = new Date(m.fecha); 
      return `${fecha.getDate()}/${fecha.getMonth() + 1}`; 
    });
    const preMediciones = this.mediciones.map((m) => m.preMedicion);
    const postMediciones = this.mediciones.map((m) => m.postMedicion);
    const glucemiasCapilares = this.mediciones.map((m) => m.glucemiaCapilar);

    this.chartOption = {
      title: {
        text: 'Mediciones de Glucosa',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Pre Medicion', 'Post Medicion' , 'Glucemia Capilar'],
        top: 'bottom',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: fechas,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} mg/dl',
        },
      },
      series: [
        {
          name: 'Pre Medicion',
          type: 'line',
          data: preMediciones,
          markPoint: {
            data: [
              { type: 'max', name: 'Máximo' },
              { type: 'min', name: 'Mínimo' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Media' }],
          },
        },
        {
          name: 'Post Medicion',
          type: 'line',
          data: postMediciones,
          markPoint: {
            data: [
              { type: 'max', name: 'Máximo' },
              { type: 'min', name: 'Mínimo' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Media' }],
          },
        },
        {
          name: 'Glucemia Capilar',
          type: 'line',
          data: glucemiasCapilares,
          markPoint: {
            data: [
              { type: 'max', name: 'Máximo' },
              { type: 'min', name: 'Mínimo' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Media' }],
          },
        },
      ],
    };
  }

  getMediciones(userId: number) {
    this.medicionesService.getMediciones(userId).subscribe({
      next: (mediciones) => {
        console.log('Datos recibidos del servidor:', mediciones);
        this.mediciones = mediciones;
        this.prepararDatosGrafico(); 
        this.calcularTotalDePaginas(); 
        this.cambiarPagina(this.paginaActual);
      },
      error: (error) => console.error(error),
    });
  }

  postMedicion() {
    let medicion = this.nuevaMedicion;
    this.medicionesService.postMediciones(medicion).subscribe({
      next: (medicion) => {
        console.log('Datos recibidos del servidor:', medicion);
        this.getMediciones(this.authService.userValue!.id);
      },
      error: (error) => console.error(error),
    });
  }
  
}
