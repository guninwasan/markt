import { uploadImage } from "./upload-image";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("uploadImage", () => {
  const file = new File(["dummy content"], "example.png", {
    type: "image/png",
  });

  it("should return the secure URL on successful upload", async () => {
    const secureUrl = "https://example.com/secure-url";
    mockedAxios.post.mockResolvedValue({ data: { secure_url: secureUrl } });

    const result = await uploadImage(file);

    expect(result).toBe(secureUrl);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it("should throw an error on failed upload", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Upload failed"));

    await expect(uploadImage(file)).rejects.toThrow("Failed to upload image");
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
