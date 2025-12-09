package com.task_api.api_task_mini.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task_api.api_task_mini.model.UserEntity;
@Repository
public interface UserRepository extends JpaRepository <UserEntity,Long>{

    Optional<UserEntity> findUserByUsername(String username);
}
