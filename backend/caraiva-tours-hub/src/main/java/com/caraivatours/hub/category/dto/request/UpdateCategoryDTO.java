package com.caraivatours.hub.category.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCategoryDTO(

    @NotBlank(message = "The category name cannot be blank")
    @Size(max=100, message = "The category name must have a maximum of 100 characters.")
    String name
) {}
