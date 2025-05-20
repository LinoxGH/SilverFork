package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Notification;
import com.SAMURAI.HU_FDS.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
    List<Notification> findByUserAndStatus(User user, Notification.Status status);
}

