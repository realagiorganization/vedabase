export type ImageGenerationRequest = {
  prompt: string;
  style?: string;
};

export type ImageGenerationResult = {
  id: string;
  url: string;
  prompt: string;
};

export const imageGenerationSuccess: ImageGenerationResult = {
  id: 'img-001',
  url: 'https://example.test/generated/murti-scene-001.png',
  prompt: 'A serene temple courtyard at sunrise',
};

export const createImageGenerationMock = () => {
  const generate = async (
    request: ImageGenerationRequest,
  ): Promise<ImageGenerationResult> => ({
    ...imageGenerationSuccess,
    prompt: request.prompt,
  });

  return {
    generate,
  };
};
