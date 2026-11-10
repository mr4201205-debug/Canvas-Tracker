package com.canvastracker.canvas_tracker.service;

import com.canvastracker.canvas_tracker.model.User;
import com.canvastracker.canvas_tracker.repository.AssignmentRepository;
import com.canvastracker.canvas_tracker.repository.NotificationPreferenceRepository;
import com.canvastracker.canvas_tracker.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    public UserService(UserRepository userRepository, AssignmentRepository assignmentRepository, NotificationPreferenceRepository notificationPreferenceRepository){
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.notificationPreferenceRepository = notificationPreferenceRepository;
    }


    public User saveUser(User user){
        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Transactional
    public void deleteAccount (User user){
        assignmentRepository.deleteAll(assignmentRepository.findByUserId(user.getId())); //foreign key present in this repo
        notificationPreferenceRepository.deleteByUserId(user.getId());
        userRepository.delete(user);
    }
}
