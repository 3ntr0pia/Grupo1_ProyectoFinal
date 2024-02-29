﻿namespace DiabetesNoteBook.Application.DTOs
{
    public class DTOLoginResponse
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public string Rol { get; set; }
        public string Nombre { get; set; }
        public string PrimerApellido { get; set; }
        public string SegundoApellido { get; set; }
        public string Avatar { get; set; }
        public string UserName { get; set; }
        public string Sexo { get; set; }
        public int Edad { get; set; }
        public decimal Peso { get; set; }
        public decimal Altura { get; set; }
        public string Actividad { get; set; }
        public string TipoDiabetes { get; set; }
        public string[] Medicación { get; set; }
        public bool Insulina { get; set; }
    }
}
