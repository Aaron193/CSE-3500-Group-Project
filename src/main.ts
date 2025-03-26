import './assets/style.css';
// import viteLogo from '/vite.svg';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

console.log('Hello from main.ts');
