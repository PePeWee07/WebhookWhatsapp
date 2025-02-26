package com.ucacue.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ucacue.app.model.entity.MessageEntity;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {


}
