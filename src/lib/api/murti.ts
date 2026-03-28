import type { DeityInfo, MurtiImage, Style } from "./types";
import { apiContracts } from "./contracts";
import { API_BASE_URL, requestContractJson } from "./http";

const MOCK_STYLES: Style[] = [
  {
    id: "temple-fresco",
    name: "Temple Fresco",
    description: "Warm devotional mural treatment with soft mineral tones.",
  },
  {
    id: "bronze-iconic",
    name: "Bronze Iconic",
    description: "Metallic sculptural rendering with shrine lighting.",
  },
  {
    id: "minimal-line-art",
    name: "Minimal Line Art",
    description: "Clean devotional silhouette with restrained ornament.",
  },
];

const MOCK_DEITIES: Record<string, DeityInfo> = {
  Shiva: {
    name: "Shiva",
    aliases: ["Mahadeva", "Shankara"],
    symbolism: ["transformation", "stillness"],
    iconography: ["trident", "crescent moon", "river Ganga"],
    description: "Ascetic and cosmic deity associated with transformation and grace.",
  },
  Durga: {
    name: "Durga",
    aliases: ["Devi", "Mahishasura Mardini"],
    symbolism: ["protection", "courage"],
    iconography: ["lion", "weapons", "radiant crown"],
    description: "Protective mother goddess associated with strength and compassion.",
  },
  Savitar: {
    name: "Savitar",
    aliases: ["Solar deity"],
    symbolism: ["illumination", "awakening"],
    iconography: ["sun rays", "golden aura"],
    description: "Vedic solar deity associated with inspiration and life-giving radiance.",
  },
};

/**
 * Generates a murti image using deity and contextual cues.
 */
export async function generateMurti(
  deity: string,
  context: string,
): Promise<MurtiImage> {
  const request = apiContracts.murti.generateMurti.validateRequest({
    deity,
    context,
  });

  if (!API_BASE_URL) {
    return {
      id: `${request.deity.toLowerCase()}-mock-murti`,
      deity: request.deity,
      context: request.context,
      style: MOCK_STYLES[0],
      imageUrl: `/mock/murti/${encodeURIComponent(request.deity.toLowerCase())}.png`,
      prompt: `Generate a devotional ${request.deity} murti for ${request.context}.`,
      createdAt: new Date().toISOString(),
    };
  }

  return requestContractJson(apiContracts.murti.generateMurti, request, {
    method: apiContracts.murti.generateMurti.method,
    body: JSON.stringify(request),
  });
}

/**
 * Lists available artistic styles for murti generation.
 */
export async function getMurtiStyles(): Promise<Style[]> {
  if (!API_BASE_URL) {
    return MOCK_STYLES;
  }

  return requestContractJson(apiContracts.murti.getStyles, {}, {
    method: apiContracts.murti.getStyles.method,
  });
}

/**
 * Fetches deity profile information used by the image flow.
 */
export async function getDeityInfo(deity: string): Promise<DeityInfo> {
  const request = apiContracts.murti.deityInfo.validateRequest({ deity });

  if (!API_BASE_URL) {
    return (
      MOCK_DEITIES[request.deity] ?? {
        name: request.deity,
        description: `Mock devotional profile for ${request.deity}.`,
      }
    );
  }

  return requestContractJson(apiContracts.murti.deityInfo, request, {
    method: apiContracts.murti.deityInfo.method,
  });
}
