package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "client_answer")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ClientAnswerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idClientAnswer;

    @ManyToOne
    @JoinColumn(name = "dni")
    private ClientEntity client;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private QuestionEntity question;

    @Column(name = "answer", length = 20, nullable = false)
    private String answer;


}
