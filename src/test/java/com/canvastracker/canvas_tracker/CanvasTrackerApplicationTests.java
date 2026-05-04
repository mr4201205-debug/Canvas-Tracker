package com.canvastracker.canvas_tracker;

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

}
