import type { Challenge, ConceptTarget } from "@/lib/types";

function c(
  id: string,
  label: string,
  dimension: ConceptTarget["dimension"],
  weight: ConceptTarget["weight"],
  synonyms: string[],
  strongPhrase: string,
  vagueFallbacks?: string[]
): ConceptTarget {
  return { id, label, dimension, weight, synonyms, strongPhrase, vagueFallbacks };
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const CHALLENGES: Challenge[] = [
  {
    id: "subway-vigil",
    number: 12,
    image: img("1743081697730-4b8d0f3de510"),
    imageAlt: "An empty, dimly lit subway station platform at night",
    originalPrompt:
      "A cinematic photograph of an abandoned subway station at night, empty tiled platform stretching into darkness, flickering fluorescent lights casting a cold blue-green glow, faint mist hanging in the stale air, wide-angle composition with strong leading lines toward a distant train tunnel, gritty urban decay, shot on a 24mm lens, high contrast, subtle film grain, eerie and desolate mood.",
    difficulty: "Easy",
    category: "Architecture",
    tags: ["urban", "night", "moody", "photography"],
    creator: "PromptLens Studio",
    createdAt: "2026-06-02",
    badPrompt: "A subway station picture.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on the lighting — it isn't natural." },
      { cost: 6, text: "The image uses a cinematic, high-contrast photography style." },
      { cost: 10, text: "Notice the leading lines pulling your eye toward a dark tunnel." },
    ],
    concepts: [
      c("subj-platform", "Empty subway platform", "subject", 3, ["subway station", "metro platform", "underground station", "train platform", "subway platform"], "an empty subway platform stretching into darkness"),
      c("env-abandoned", "Abandoned / decayed", "environment", 2, ["abandoned", "derelict", "decaying", "urban decay", "neglected"], "an abandoned, decaying subway station", ["old", "run down"]),
      c("env-tunnel", "Dark train tunnel", "environment", 2, ["dark tunnel", "train tunnel", "disappearing into darkness", "tunnel entrance"], "a train tunnel swallowed in darkness"),
      c("comp-lines", "Leading lines / symmetry", "composition", 2, ["leading lines", "vanishing point", "symmetrical corridor", "converging lines"], "strong leading lines converging on a vanishing point"),
      c("comp-wide", "Wide-angle framing", "composition", 1, ["wide shot", "wide angle composition", "wide frame"], "a wide-angle composition"),
      c("style-cinematic", "Cinematic photography", "style", 2, ["cinematic", "film still", "cinematic photograph", "movie still"], "a cinematic photograph"),
      c("light-fluorescent", "Flickering fluorescent light", "lighting", 3, ["fluorescent lights", "flickering lights", "harsh overhead lighting", "fluorescent glow"], "flickering fluorescent lights overhead", ["bright lights", "some light"]),
      c("color-coldtone", "Cold blue-green tone", "color", 2, ["blue-green tint", "cold color palette", "cyan tint", "cool tones"], "a cold blue-green color grade"),
      c("cam-24mm", "24mm wide lens", "camera", 1, ["24mm", "wide-angle lens", "wide lens"], "shot on a 24mm wide-angle lens"),
      c("mood-eerie", "Eerie, desolate mood", "mood", 2, ["eerie", "desolate", "unsettling", "haunting", "lonely", "creepy"], "an eerie, desolate atmosphere"),
      c("spec-mist", "Mist in the air", "specificity", 1, ["mist", "haze", "fog in the air", "hazy air"], "faint mist hanging in the stale air"),
      c("spec-grain", "Film grain", "specificity", 1, ["film grain", "grainy texture", "grain"], "subtle film grain"),
    ],
  },
  {
    id: "astronaut-vigil",
    number: 15,
    image: img("1712512162273-2a622d8b0c74"),
    imageAlt: "An astronaut in a spacesuit standing before a space station with Earth behind",
    originalPrompt:
      "A cinematic photograph of an astronaut in a white spacesuit standing in front of a massive space station module, Earth's curved horizon glowing faintly behind them, the deep black void of space above, dramatic rim lighting along the suit's edges, wide shot emphasizing scale and isolation, ultra-detailed reflective visor, muted metallic color palette, shot like a still from a sci-fi epic, sharp focus, subtle lens flare.",
    difficulty: "Medium",
    category: "Sci-Fi",
    tags: ["space", "astronaut", "cinematic", "sci-fi"],
    creator: "PromptLens Studio",
    createdAt: "2026-05-18",
    badPrompt: "An astronaut in space.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on the lighting along the edges of the suit." },
      { cost: 6, text: "The image uses a cinematic sci-fi photography style." },
      { cost: 10, text: "Notice what's glowing faintly behind the astronaut — it isn't just black space." },
    ],
    concepts: [
      c("subj-astronaut", "Astronaut in spacesuit", "subject", 3, ["astronaut", "spaceman", "person in a spacesuit", "cosmonaut", "space suit"], "an astronaut in a white spacesuit"),
      c("subj-visor", "Reflective helmet visor", "subject", 2, ["visor", "helmet reflection", "reflective visor", "helmet"], "an ultra-detailed reflective visor"),
      c("env-station", "Space station structure", "environment", 3, ["space station", "space module", "spacecraft structure", "orbital station"], "a massive space station module", ["a spaceship", "a building"]),
      c("env-void", "Void of space / stars", "environment", 2, ["outer space", "void of space", "deep space", "starfield", "space background"], "the deep black void of space"),
      c("env-earth", "Earth's horizon", "environment", 2, ["earth's horizon", "planet horizon", "curvature of the earth", "earth in the background"], "Earth's curved horizon glowing behind them"),
      c("comp-scale", "Wide shot, scale & isolation", "composition", 2, ["wide shot", "scale and isolation", "small figure in a vast scene", "sense of scale"], "a wide shot emphasizing scale and isolation"),
      c("style-cinematic", "Cinematic sci-fi still", "style", 2, ["cinematic", "sci-fi epic", "science fiction still", "movie still"], "a still from a sci-fi epic"),
      c("light-rim", "Dramatic rim lighting", "lighting", 3, ["rim lighting", "backlit edge glow", "rim light", "edge lighting"], "dramatic rim lighting along the suit's edges", ["nice lighting", "good light"]),
      c("color-metallic", "Muted metallic palette", "color", 2, ["metallic tones", "muted colors", "silver and grey palette", "desaturated metallics"], "a muted metallic color palette"),
      c("cam-flare", "Lens flare", "camera", 1, ["lens flare", "flare"], "a subtle lens flare"),
      c("mood-isolation", "Isolation & awe", "mood", 2, ["isolation", "solitude", "awe", "vastness", "wonder"], "a mood of isolation and awe"),
      c("spec-detail", "Ultra-detailed, sharp focus", "specificity", 1, ["ultra-detailed", "sharp focus", "highly detailed", "crisp detail"], "ultra-detailed and sharply focused"),
    ],
  },
  {
    id: "neon-rain-alley",
    number: 8,
    image: img("1759273621970-79e048b38cd2"),
    imageAlt: "A rain-soaked city street at night lit by colorful neon signs",
    originalPrompt:
      "A cinematic street photograph of a rain-soaked city alley at night, glowing neon signs in red, pink and blue reflecting off wet pavement, blurred pedestrians with umbrellas under the lights, dense atmospheric fog, shot on a 35mm lens with shallow depth of field, vibrant saturated colors, moody Blade Runner-inspired atmosphere, long exposure light trails, realistic photography with subtle film grain.",
    difficulty: "Medium",
    category: "Cinematic",
    tags: ["night", "rain", "neon", "street photography"],
    creator: "PromptLens Studio",
    createdAt: "2026-04-27",
    badPrompt: "A rainy street with lights.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on what's happening to the light on the ground." },
      { cost: 6, text: "The image uses a cinematic, Blade Runner-inspired color grade." },
      { cost: 10, text: "The photographer used a shallow depth of field with a mid-range lens." },
    ],
    concepts: [
      c("subj-neon", "Neon signs", "subject", 3, ["neon signs", "neon signage", "illuminated signs", "glowing signs"], "glowing neon signs in red, pink and blue"),
      c("subj-people", "Pedestrians with umbrellas", "subject", 1, ["pedestrians", "people with umbrellas", "crowd", "figures walking"], "blurred pedestrians with umbrellas"),
      c("env-rain", "Rain-soaked street", "environment", 3, ["rain", "rainy street", "wet pavement", "rain-soaked", "raining"], "a rain-soaked street", ["outside", "a city"]),
      c("env-alley", "City alley at night", "environment", 2, ["city alley", "night alley", "urban alley", "narrow street"], "a city alley at night"),
      c("comp-reflections", "Reflections on wet ground", "composition", 2, ["reflections", "wet reflections", "puddle reflections", "light reflecting on the ground"], "neon reflecting off wet pavement"),
      c("style-cinematic", "Cinematic street photography", "style", 2, ["cinematic", "street photography", "film still"], "cinematic street photography"),
      c("style-bladerunner", "Blade Runner / cyberpunk mood", "style", 1, ["blade runner", "cyberpunk atmosphere", "neo-noir"], "a Blade Runner-inspired atmosphere"),
      c("light-neonglow", "Neon glow lighting", "lighting", 2, ["neon glow", "colorful glow", "ambient neon light"], "glowing ambient neon lighting"),
      c("color-saturated", "Saturated red/pink/blue", "color", 2, ["saturated colors", "vibrant neon colors", "red and blue tones", "colorful palette"], "vibrant saturated neon colors"),
      c("cam-35mm", "35mm, shallow depth of field", "camera", 2, ["35mm lens", "shallow depth of field", "bokeh"], "shot on a 35mm lens with shallow depth of field"),
      c("cam-longexposure", "Long exposure light trails", "camera", 1, ["long exposure", "light trails"], "long exposure light trails"),
      c("mood-moody", "Moody, atmospheric", "mood", 1, ["moody", "atmospheric", "mysterious"], "a moody, atmospheric feel"),
      c("spec-fog", "Fog / mist", "specificity", 1, ["fog", "mist", "haze"], "dense atmospheric fog"),
    ],
  },
  {
    id: "macro-morpho",
    number: 41,
    image: img("1558604365-a94006654196"),
    imageAlt: "An extreme macro photograph of a blue morpho butterfly on a leaf",
    originalPrompt:
      "An extreme macro photograph of a blue morpho butterfly perched on a green leaf, iridescent wings covered in fine dew droplets catching soft natural light, razor-thin depth of field isolating the wing texture, blurred lush green background bokeh, delicate wing scales visible in crisp detail, soft diffused daylight, vivid blue and emerald color palette, shot with a macro lens, tranquil and delicate mood.",
    difficulty: "Hard",
    category: "Nature",
    tags: ["macro", "butterfly", "nature", "close-up"],
    creator: "PromptLens Studio",
    createdAt: "2026-07-09",
    badPrompt: "A close up of a butterfly.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on how close the camera is to the subject." },
      { cost: 6, text: "The image uses an extreme macro photography style." },
      { cost: 10, text: "Look closely at the wing surface — there's moisture on it." },
    ],
    concepts: [
      c("subj-butterfly", "Blue morpho butterfly", "subject", 3, ["butterfly", "blue morpho", "morpho butterfly", "moth"], "a blue morpho butterfly"),
      c("subj-dew", "Dew droplets on wings", "subject", 2, ["dew drops", "water droplets", "dew", "moisture on wings"], "fine dew droplets on the wings"),
      c("env-leaf", "Perched on a green leaf", "environment", 2, ["leaf", "resting on a leaf", "perched on foliage"], "perched on a green leaf"),
      c("env-bg", "Blurred green background", "environment", 1, ["green background", "foliage backdrop", "garden background"], "a blurred lush green background"),
      c("comp-macro", "Extreme macro close-up", "composition", 3, ["macro shot", "extreme close-up", "close-up photography", "macro photo"], "an extreme macro close-up", ["a close up", "zoomed in"]),
      c("comp-bokeh", "Shallow depth, blurred bg", "composition", 2, ["bokeh", "blurred background", "shallow depth of field"], "razor-thin depth of field with soft bokeh"),
      c("style-macro", "Nature macro photography", "style", 2, ["macro photography", "nature photography"], "nature macro photography"),
      c("light-diffused", "Soft diffused daylight", "lighting", 2, ["soft light", "diffused light", "natural daylight"], "soft diffused natural daylight"),
      c("color-vivid", "Vivid blue & emerald", "color", 2, ["vivid blue", "iridescent blue", "emerald green", "blue and green tones"], "vivid iridescent blue and emerald tones"),
      c("cam-macrolens", "Macro lens", "camera", 1, ["macro lens"], "shot with a macro lens"),
      c("mood-tranquil", "Tranquil, delicate", "mood", 1, ["tranquil", "delicate", "serene", "calm", "peaceful"], "a tranquil, delicate mood"),
      c("spec-scales", "Fine wing scale texture", "specificity", 1, ["wing texture", "wing scales", "intricate detail", "fine detail"], "delicate wing scales in crisp detail"),
    ],
  },
  {
    id: "rooftop-skyline",
    number: 3,
    image: img("1756072226051-f6835aec4f9a"),
    imageAlt: "A city skyline of skyscrapers viewed from a rooftop at sunset",
    originalPrompt:
      "A cinematic wide shot of a dense city skyline viewed from a rooftop at sunset, glass skyscrapers glowing amber and pink under a warm setting sun, faint haze softening the distant towers, dramatic silhouette of the rooftop foreground, warm golden and violet color gradient across the sky, high dynamic range, shot on a wide-angle lens, epic and awe-inspiring mood, ultra-detailed architectural photography.",
    difficulty: "Easy",
    category: "Architecture",
    tags: ["city", "skyline", "sunset", "architecture"],
    creator: "PromptLens Studio",
    createdAt: "2026-03-11",
    badPrompt: "A city at sunset.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on the time of day and the color of the sky." },
      { cost: 6, text: "Notice the dark shape framing the bottom of the shot." },
      { cost: 10, text: "This was shot with a lens wide enough to fit the whole skyline in frame." },
    ],
    concepts: [
      c("subj-skyline", "City skyline / skyscrapers", "subject", 3, ["skyline", "skyscrapers", "city towers", "high-rises", "glass towers"], "a dense skyline of glass skyscrapers"),
      c("subj-rooftop", "Rooftop vantage point", "subject", 2, ["rooftop", "rooftop view", "viewed from a roof", "rooftop silhouette"], "viewed from a rooftop"),
      c("env-city", "Dense futuristic city", "environment", 2, ["futuristic city", "urban skyline", "metropolis", "downtown"], "a dense, futuristic-feeling city"),
      c("env-haze", "Haze over distant towers", "environment", 1, ["haze", "atmospheric haze", "smog", "hazy air"], "faint haze softening the distant towers"),
      c("comp-silhouette", "Silhouette foreground", "composition", 2, ["silhouette", "foreground silhouette", "dark foreground shape"], "a dramatic silhouette in the foreground"),
      c("style-architectural", "Cinematic architectural photo", "style", 1, ["cinematic", "architectural photography"], "cinematic architectural photography"),
      c("light-sunset", "Sunset / golden light", "lighting", 3, ["sunset", "golden hour", "warm setting sun", "dusk light"], "warm golden-hour sunset light", ["nice lighting", "pretty light"]),
      c("color-gradient", "Amber/pink/violet gradient", "color", 2, ["amber and pink", "violet gradient", "warm sky colors", "orange and purple sky"], "a warm golden-to-violet sky gradient"),
      c("cam-wide", "Wide-angle lens", "camera", 1, ["wide-angle lens", "wide lens"], "shot on a wide-angle lens"),
      c("cam-hdr", "High dynamic range", "camera", 1, ["hdr", "high dynamic range"], "high dynamic range"),
      c("mood-epic", "Epic, awe-inspiring", "mood", 2, ["epic", "awe-inspiring", "grand", "majestic"], "an epic, awe-inspiring mood"),
      c("spec-glass", "Glass tower reflections", "specificity", 1, ["glass towers", "reflective glass", "glass facades"], "glowing glass facades"),
    ],
  },
  {
    id: "cabin-glow",
    number: 1,
    image: img("1677350840522-ad55f426d048"),
    imageAlt: "A small wooden cabin glowing with warm light in a snowy forest at night",
    originalPrompt:
      "A cozy cinematic photograph of a small wooden cabin nestled deep in a snow-covered forest at night, warm golden light glowing through the windows, snow blanketing the roof and surrounding pine trees, a soft trail of smoke rising from the chimney, deep blue twilight sky, tranquil and inviting atmosphere, shallow depth of field with the cabin sharply in focus, realistic photography with a warm-cool color contrast.",
    difficulty: "Easy",
    category: "Nature",
    tags: ["winter", "cabin", "cozy", "night"],
    creator: "PromptLens Studio",
    createdAt: "2026-01-14",
    badPrompt: "A house in the snow.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on the light coming from inside the building." },
      { cost: 6, text: "Notice the contrast between two color temperatures in this image." },
      { cost: 10, text: "The sky isn't black — it's a deep, specific shade." },
    ],
    concepts: [
      c("subj-cabin", "Wooden cabin", "subject", 3, ["cabin", "wooden house", "log cabin", "cottage", "small house"], "a small wooden cabin", ["a house", "a building"]),
      c("subj-smoke", "Smoke from chimney", "subject", 1, ["chimney smoke", "smoke rising", "smoking chimney"], "a soft trail of smoke from the chimney"),
      c("env-snowforest", "Snow-covered forest", "environment", 3, ["snowy forest", "snow-covered trees", "pine forest", "winter woods"], "a snow-covered pine forest"),
      c("env-night", "Night twilight sky", "environment", 2, ["night sky", "twilight", "dusk", "blue hour"], "a deep blue twilight sky"),
      c("comp-focus", "Cabin sharply in focus", "composition", 1, ["centered composition", "cabin in focus", "cabin as focal point"], "the cabin sharply in focus"),
      c("style-cozy", "Cozy cinematic photography", "style", 2, ["cozy", "cinematic photograph", "warm scene"], "a cozy, cinematic photograph"),
      c("light-window", "Warm window glow", "lighting", 3, ["warm light through windows", "glowing windows", "warm interior light", "light from windows"], "warm golden light glowing through the windows", ["some light", "lit up"]),
      c("color-contrast", "Warm-cool color contrast", "color", 2, ["warm and cool contrast", "orange and blue tones", "warm-cool palette"], "a warm-cool color contrast"),
      c("cam-shallow", "Shallow depth of field", "camera", 1, ["shallow depth of field", "soft focus background"], "shallow depth of field"),
      c("mood-cozy", "Tranquil, inviting", "mood", 2, ["cozy", "tranquil", "inviting", "peaceful", "serene"], "a tranquil, inviting atmosphere"),
      c("spec-snowroof", "Snow blanketing roof/trees", "specificity", 1, ["snow blanket", "snow-covered roof", "thick snow", "snow on the trees"], "snow blanketing the roof and trees"),
    ],
  },
  {
    id: "ridge-golden-hour",
    number: 27,
    image: img("1700254782441-0a96ed1c8b55"),
    imageAlt: "A hiker in a red jacket standing on a rocky mountain ridge at golden hour",
    originalPrompt:
      "A cinematic photograph of a hiker in a red jacket standing on a rocky mountain ridge at golden hour, towering snow-covered peaks in the background, atmospheric fog drifting between the mountains, shallow depth of field, soft warm rim lighting, shot on a 35mm lens, realistic photography, subtle film grain.",
    difficulty: "Medium",
    category: "Photography",
    tags: ["mountains", "hiking", "golden hour", "portrait"],
    creator: "PromptLens Studio",
    createdAt: "2026-08-02",
    badPrompt: "A beautiful mountain picture.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on the lighting." },
      { cost: 6, text: "The image uses a cinematic photography style." },
      { cost: 10, text: "The subject was photographed using a shallow depth of field." },
    ],
    concepts: [
      c("subj-hiker", "Hiker in red jacket", "subject", 3, ["hiker", "red jacket", "red hiking jacket", "person in a red coat", "figure in red"], "a hiker in a red jacket"),
      c("env-ridge", "Rocky mountain ridge", "environment", 2, ["mountain ridge", "rocky ridge", "rocky outcrop"], "a rocky mountain ridge"),
      c("env-peaks", "Snow-covered peaks", "environment", 3, ["snow-covered peaks", "snowy mountains", "snow-capped mountains", "alps"], "towering snow-covered peaks", ["mountains", "big mountains"]),
      c("env-fog", "Fog between the peaks", "environment", 2, ["fog", "mist between mountains", "atmospheric haze", "fog drifting"], "atmospheric fog drifting between the peaks"),
      c("comp-figure", "Figure on the ridge", "composition", 1, ["standing figure", "small figure in landscape", "figure on the ridge"], "a lone figure standing on the ridge"),
      c("style-cinematic", "Cinematic realistic photo", "style", 2, ["cinematic", "realistic photography", "photorealistic"], "a cinematic, realistic photograph"),
      c("light-goldenhour", "Golden hour light", "lighting", 3, ["golden hour", "warm sunset lighting", "warm glow", "golden light"], "warm golden-hour light", ["beautiful lighting", "nice light"]),
      c("light-rim", "Rim lighting", "lighting", 2, ["rim lighting", "rim light", "backlit glow"], "soft warm rim lighting"),
      c("color-warm", "Warm golden tones", "color", 1, ["warm tones", "golden color palette"], "warm golden tones"),
      c("cam-35mm", "35mm, shallow depth of field", "camera", 2, ["35mm lens", "shallow depth of field", "bokeh background"], "shot on a 35mm lens with shallow depth of field"),
      c("cam-grain", "Film grain", "camera", 1, ["film grain", "grainy"], "subtle film grain"),
      c("mood-adventurous", "Adventurous, serene", "mood", 1, ["adventurous", "serene", "epic", "majestic"], "an adventurous, serene mood"),
      c("spec-tilt", "Slight camera tilt", "specificity", 1, ["camera tilt", "tilted angle", "dutch angle", "angled shot"], "a slight camera tilt"),
    ],
  },
  {
    id: "neon-metropolis",
    number: 19,
    image: img("1672872476232-da16b45c9001"),
    imageAlt: "A futuristic cyberpunk city skyline glowing with neon lights at night",
    originalPrompt:
      "A cinematic wide shot of a futuristic cyberpunk city at night, towering skyscrapers covered in glowing neon signage and holographic billboards, dense fog rolling between the buildings, vivid pink and cyan neon lighting reflecting off dark glass and wet streets, flying vehicles with light trails in the distance, ultra-detailed sci-fi concept art style, dramatic low-angle composition, moody dystopian atmosphere, high contrast digital rendering.",
    difficulty: "Hard",
    category: "Cyberpunk",
    tags: ["cyberpunk", "neon", "city", "concept art"],
    creator: "PromptLens Studio",
    createdAt: "2026-06-30",
    badPrompt: "A futuristic city with lights.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on the two dominant neon colors." },
      { cost: 6, text: "The image uses a sci-fi concept art rendering style, not a photo." },
      { cost: 10, text: "Look at the camera angle — you're looking up, not straight ahead." },
    ],
    concepts: [
      c("subj-towers", "Neon skyscrapers", "subject", 3, ["neon skyscrapers", "glowing towers", "illuminated buildings"], "towering skyscrapers covered in neon signage"),
      c("subj-holo", "Holographic billboards", "subject", 2, ["holographic billboards", "holograms", "digital billboards"], "holographic billboards"),
      c("env-cyberpunk", "Futuristic cyberpunk city", "environment", 3, ["cyberpunk city", "futuristic metropolis", "dystopian city"], "a futuristic cyberpunk city"),
      c("env-fog", "Fog between buildings", "environment", 1, ["fog", "mist", "smog between towers"], "fog rolling between the buildings"),
      c("comp-lowangle", "Low-angle wide shot", "composition", 2, ["low-angle shot", "looking up composition", "wide shot"], "a dramatic low-angle wide shot"),
      c("style-conceptart", "Sci-fi concept art", "style", 2, ["concept art", "sci-fi illustration", "digital art style", "digital painting"], "ultra-detailed sci-fi concept art"),
      c("light-neon", "Neon glow lighting", "lighting", 2, ["neon lighting", "glowing neon", "colorful glow"], "vivid neon lighting"),
      c("color-pinkcyan", "Pink and cyan palette", "color", 3, ["pink and cyan", "magenta and blue", "neon color palette"], "a vivid pink and cyan color palette", ["colorful", "bright colors"]),
      c("cam-contrast", "High contrast rendering", "camera", 1, ["high contrast", "dramatic contrast"], "high contrast digital rendering"),
      c("spec-vehicles", "Flying vehicles / light trails", "specificity", 2, ["flying cars", "light trails", "hover vehicles", "flying vehicles"], "flying vehicles leaving light trails"),
      c("spec-wetstreets", "Wet reflective streets", "specificity", 1, ["wet streets", "reflective pavement", "rain-slicked road"], "wet, reflective streets"),
      c("mood-dystopian", "Dystopian, moody", "mood", 2, ["dystopian", "moody", "dark futuristic mood"], "a moody, dystopian atmosphere"),
    ],
  },
  {
    id: "castle-mist",
    number: 34,
    image: img("1763396238781-5858a1d95e34"),
    imageAlt: "An ancient stone castle on a misty, forested hill",
    originalPrompt:
      "An epic fantasy matte painting of an ancient stone castle perched on a misty hill surrounded by dense pine forest, thick rolling fog swallowing the lower towers, dramatic overcast lighting with soft diffused grey tones, moody and mysterious atmosphere, wide establishing shot emphasizing scale, muted green and grey color palette, highly detailed concept art, subtle painterly texture, cinematic fantasy illustration.",
    difficulty: "Hard",
    category: "Fantasy",
    tags: ["fantasy", "castle", "fog", "concept art"],
    creator: "PromptLens Studio",
    createdAt: "2026-07-22",
    badPrompt: "A castle on a hill.",
    published: true,
    hints: [
      { cost: 3, text: "Focus on the weather — it's not a clear, sunny day." },
      { cost: 6, text: "This isn't a photograph — it's a painted, illustrated style." },
      { cost: 10, text: "Notice the fog is doing something specific to the lower part of the castle." },
    ],
    concepts: [
      c("subj-castle", "Ancient stone castle", "subject", 3, ["castle", "ancient castle", "stone fortress", "medieval castle"], "an ancient stone castle"),
      c("env-hill", "Misty hill", "environment", 2, ["misty hill", "foggy hilltop", "hill shrouded in mist"], "perched on a misty hill"),
      c("env-forest", "Surrounding pine forest", "environment", 2, ["pine forest", "surrounding trees", "forested hill"], "surrounded by dense pine forest"),
      c("env-rollingfog", "Rolling fog on towers", "environment", 2, ["rolling fog", "thick fog", "fog swallowing towers"], "thick rolling fog swallowing the lower towers", ["some fog", "misty"]),
      c("comp-establishing", "Wide establishing shot", "composition", 2, ["wide establishing shot", "epic wide shot", "scale-emphasizing composition"], "a wide establishing shot emphasizing scale"),
      c("style-mattepainting", "Fantasy matte painting", "style", 3, ["matte painting", "fantasy concept art", "fantasy illustration", "digital painting"], "an epic fantasy matte painting", ["a fantasy picture", "digital art"]),
      c("light-overcast", "Overcast, diffused light", "lighting", 2, ["overcast lighting", "diffused grey light", "soft grey light", "cloudy light"], "dramatic overcast lighting"),
      c("color-mutedgreen", "Muted green & grey", "color", 2, ["muted green and grey", "desaturated palette", "grey-green tones"], "a muted green and grey color palette"),
      c("mood-moody", "Moody, mysterious", "mood", 2, ["moody", "mysterious", "eerie", "foreboding"], "a moody, mysterious atmosphere"),
      c("spec-painterly", "Painterly texture", "specificity", 1, ["painterly texture", "brushwork", "painted detail"], "subtle painterly texture"),
      c("spec-detailed", "Highly detailed", "specificity", 1, ["highly detailed", "intricate detail"], "highly detailed"),
    ],
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export function getPublishedChallenges(): Challenge[] {
  return CHALLENGES.filter((c) => c.published);
}

export function getDailyChallenge(): Challenge {
  const day = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < day.length; i++) hash = (hash * 31 + day.charCodeAt(i)) >>> 0;
  const list = getPublishedChallenges();
  return list[hash % list.length];
}

export function getNextChallenge(currentId: string): Challenge {
  const list = getPublishedChallenges();
  const idx = list.findIndex((c) => c.id === currentId);
  return list[(idx + 1) % list.length];
}
