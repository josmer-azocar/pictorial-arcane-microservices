package com.pictorial.recommendation_service.web;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "eureka.client.enabled=false",
        "spring.cloud.config.enabled=false"
})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ArtworkPublicControllerIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void testSmartSearchResponseFormat() throws Exception {
        mockMvc.perform(get("/api/v1/artworks/search-smart")
                        .param("query", "cuadros expresionistas azules")
                        .param("page", "0")
                        .param("size", "5"))
                .andDo(result -> {
                    System.out.println("SMART SEARCH STATUS: " + result.getResponse().getStatus());
                    System.out.println("SMART SEARCH RESPONSE: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").exists())
                .andExpect(jsonPath("$.obras").exists())
                .andExpect(jsonPath("$.obras.content").isArray())
                // Verify 'embedding' attribute is ignored/not visible
                .andExpect(jsonPath("$.obras.content[*].embedding").doesNotExist())
                // Verify 'artist' field is populated and exists
                .andExpect(jsonPath("$.obras.content[*].artist").exists())
                .andExpect(jsonPath("$.obras.content[*].artist.name").exists());
    }
}
