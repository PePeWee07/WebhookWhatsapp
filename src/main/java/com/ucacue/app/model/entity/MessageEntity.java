package com.ucacue.app.model.entity;

import jakarta.validation.constraints.Size;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "message")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Identificador único
    
    private String messageId; // ID del mensaje (de WhatsApp)
    private String waId; // Número telefónico del remitente
    private String timestamp; // Fecha y hora formateada, ejemplo: "2025-02-25 16:39:22"
    
    @Size(max = 1000)
    private String content; // Contenido del mensaje
    private String type; // Tipo de mensaje (ej. "text")
}

