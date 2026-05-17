package com.uneg.pictorialArcane.persistence.entity;

import com.uneg.pictorialArcane.persistence.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class QuestionEntity extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_question")
    private Long idQuestion;

    @Column(name = "wording", nullable = false, length = 50, unique = true)
    private String wording;

    @OneToMany(mappedBy = "question")
    private List<ClientAnswerEntity> clientAnswers = new ArrayList<>();
}
