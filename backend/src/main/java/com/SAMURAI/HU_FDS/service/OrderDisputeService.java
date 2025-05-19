package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.Order;
import com.SAMURAI.HU_FDS.model.OrderDispute;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.OrderDisputeRepository;
import com.SAMURAI.HU_FDS.repo.OrderRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderDisputeService {

    @Autowired
    private OrderDisputeRepository repository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public OrderDispute create(String username, Long orderId, String reason) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = orderRepository.findById(orderId).orElseThrow();

        OrderDispute dispute = new OrderDispute();
        dispute.setRaisedBy(user);
        dispute.setOrder(order);
        dispute.setReason(reason);
        dispute.setCreatedAt(LocalDateTime.now());

        return repository.save(dispute);
    }

    public List<OrderDispute> getAll() {
        return repository.findAll();
    }

    public List<OrderDispute> getByUser(String username) {
        return repository.findByRaisedBy_Username(username);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}