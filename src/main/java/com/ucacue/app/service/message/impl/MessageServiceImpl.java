package com.ucacue.app.service.message.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import com.ucacue.app.model.entity.MessageEntity;
import com.ucacue.app.repository.MessageRepository;
import com.ucacue.app.service.Utils;
import com.ucacue.app.service.message.MessageService;

public class MessageServiceImpl implements MessageService {

    @Autowired
    MessageRepository messageRepository;

    
    public MessageEntity save(MessageEntity messageEntity) {
        try {
            return messageRepository.save(messageEntity);
        } catch(Exception ex) {
            // TODO: logger.error("Error al guardar mensaje", ex);
            throw ex;
        }
    }

    @Override
    public MessageEntity processAndSave(String jsonData) throws Exception {
        JSONObject json = new JSONObject(jsonData);
        JSONObject entry = json.getJSONArray("entry").getJSONObject(0);
        JSONObject change = entry.getJSONArray("changes").getJSONObject(0);
        JSONObject value = change.getJSONObject("value");
        
        String waId = value.getJSONArray("contacts").getJSONObject(0).getString("wa_id");
        JSONObject message = value.getJSONArray("messages").getJSONObject(0);
        String messageId = message.getString("id");
        String timestamp = message.getString("timestamp");
        String type = message.getString("type");
        String content = message.getJSONObject("text").getString("body");
        
        long ts = Long.parseLong(timestamp);
        String formattedTimestamp = Utils.convertTimeStamp(ts);
        
        MessageEntity messageEntity = new MessageEntity();
        messageEntity.setWaId(waId);
        messageEntity.setMessageId(messageId);
        messageEntity.setTimestamp(formattedTimestamp);
        messageEntity.setType(type);
        messageEntity.setContent(content);
        
        return messageRepository.save(messageEntity);
    }
    
}
