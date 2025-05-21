package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.Notification;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.NotificationRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class NotificationService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;



    public List<Notification> getNotificationsByStatus(String username, String status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        switch (status.toLowerCase()) {
            case "read":
                return notificationRepository.findByUserAndStatus(user, Notification.Status.READ);
            case "unread":
                return notificationRepository.findByUserAndStatus(user, Notification.Status.UNREAD);
            case "both":
            default:
                return notificationRepository.findByUser(user);
        }

    }

    public void markNotificationAsRead(String username, Long id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        notification.setStatus(Notification.Status.READ);
        notificationRepository.save(notification);

    }


    public void sendNotificationToUser(String username, String message) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setStatus(Notification.Status.UNREAD);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public void deleteNotification(String username, Long id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        notificationRepository.delete(notification);
    }

}
