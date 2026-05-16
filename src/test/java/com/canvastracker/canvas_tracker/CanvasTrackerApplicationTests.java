package com.canvastracker.canvas_tracker;

import java.time.LocalDateTime;
import com.canvastracker.canvas_tracker.model.Assignment;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import com.canvastracker.canvas_tracker.model.User;

class CanvasTrackerApplicationTests {

	@Test
	void userFieldsShouldStoreCorrectly() {
		User user = new User();
		user.setName("Mushfiqur");
		user.setEmail("mushfiqur@email.com");
		user.setCanvasToken("abc123");

		assertEquals("Mushfiqur", user.getName()); //assertions check if every value is true. Left is expected and right is actual
		assertEquals("mushfiqur@email.com", user.getEmail());
		assertEquals("abc123", user.getCanvasToken());
	}

	@Test
	void saveUserShouldReturnUserWithName(){
		User user = new User();
		user.setName("Mushfiqur");
		user.setEmail("mushfiqur@email.com");
		user.setCanvasToken("testtoken123");

		assertEquals("Mushfiqur", user.getName());
		assertNotNull(user.getName());
	}
	@Test
	void assignmentFieldsShouldStoreCorrectly() {
		Assignment assignment = new Assignment();
		assignment.setTitle("Research Paper");
		assignment.setCourseName("English 101");
		assignment.setPoints(100.0);
		assignment.setGradeWeight(25.0);
		assignment.setSubmitted(false);

		assertEquals("Research Paper", assignment.getTitle());
		assertEquals("English 101", assignment.getCourseName());
		assertEquals(100.0, assignment.getPoints());
		assertEquals(25.0, assignment.getGradeWeight());
		assertFalse(assignment.isSubmitted());
	}

	@Test
	void assignmentDueDateShouldBeInFuture() {
		Assignment assignment = new Assignment();
		assignment.setTitle("Research Paper");
		assignment.setCourseName("English 101");
		assignment.setDueDate(LocalDateTime.now().plusDays(7));
		assignment.setPoints(100.0);
		assignment.setSubmitted(false);

		assertTrue(assignment.getDueDate().isAfter(LocalDateTime.now()));
	}

}
