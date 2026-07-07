package com.canvastracker.canvas_tracker.repository;

import java.util.Optional;
import com.canvastracker.canvas_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);//optional because some users might not have a specific email
}
