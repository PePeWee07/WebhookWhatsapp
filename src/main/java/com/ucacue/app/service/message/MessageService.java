package com.ucacue.app.service.message;

import com.ucacue.app.model.entity.MessageEntity;

public interface MessageService {

    MessageEntity save(MessageEntity messageEntity);
    MessageEntity processAndSave(String jsonData) throws Exception;
}
