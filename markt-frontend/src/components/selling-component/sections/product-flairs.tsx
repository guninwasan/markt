import React from "react";
import { TagContainer, Tag, SectionHeader } from "../selling-component.styles";

const ProductFlairs = ({ formData, handleTagSelection }: any) => (
  <>
    <SectionHeader>Product Flairs</SectionHeader>
    <TagContainer>
      {["Like New", "Limited Edition", "Free Shipping", "Popular"].map(
        (tag) => (
          <Tag
            key={tag}
            selected={formData.flairs.includes(tag)}
            onClick={() => handleTagSelection(tag)}
          >
            {tag}
          </Tag>
        )
      )}
    </TagContainer>
  </>
);

export { ProductFlairs };
