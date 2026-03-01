package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class QuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_question")
    private Long idQuestion;

    @Column(name = "wording", nullable = false, length = 50, unique = true)
    private String wording;

    @OneToMany(mappedBy = "question")
    private List<ClientAnswerEntity> clientAnswers = new ArrayList<>();
}
