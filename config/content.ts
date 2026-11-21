export const howItWorksSteps = [
  {
    title: "Select an image",
    description:
      "Drag and drop your image into the upload area, or click to browse your files. JPG, PNG and WebP are supported.",
  },
  {
    title: "Choose an editing tool",
    description:
      "Compress, resize, crop, rotate or convert — pick the tool that fits your task and adjust the settings.",
  },
  {
    title: "Download your result",
    description:
      "Get your edited image instantly and download it to your device. No signup, no watermarks.",
  },
] as const;

export const privacyPoints = [
  {
    title: "No server uploads",
    description:
      "Core tools process your images directly in your browser. Your files are never sent to our servers.",
  },
  {
    title: "Works without an account",
    description:
      "No signup, no login and no personal data required — just open a tool and start editing.",
  },
  {
    title: "Full control over your files",
    description:
      "Images stay on your device until you choose to download the result. Close the tab and nothing remains.",
  },
] as const;

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Is this platform free to use?",
    answer:
      "Yes. All core tools are completely free, with no watermarks and no hidden limits. You can compress, convert and edit images as often as you like.",
  },
  {
    question: "Which image formats are supported?",
    answer:
      "The core tools support the three most common formats: JPG, PNG and WebP. You can convert between them and compress or edit files in any of these formats.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. For the core tools, all processing happens directly in your browser using modern web technology. Your images never leave your device, which makes the tools fast and private.",
  },
  {
    question: "Will compressing an image reduce its quality?",
    answer:
      "Compression finds and removes redundant data, so small quality changes are usually invisible. The tools give you quality control, so you can balance file size against image sharpness before downloading.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. There is no signup or login. Open the tool you need, drop in your image and download the result — that's it.",
  },
  {
    question: "Can I use the tools on my phone or tablet?",
    answer:
      "Yes. The whole platform is fully responsive and works in modern mobile browsers, so you can edit images on desktop, tablet and mobile.",
  },
] as const;
