const content = `
{
  "compilerOptions": {
    "noEmit": true,
    "esModuleInterop": true,
    "jsx": "react",
    "lib": ["esnext", "dom"],
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true
  }
}
`;

export const config = {
  filename: "tsconfig.json",
  content,
};
