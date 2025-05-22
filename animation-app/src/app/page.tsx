import AnimationFrame from './components/AnimationFrame';

export default function Home() {
  return (
    <main
      style={{
        margin: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'calc(100vw - 160px)',
        height: 'calc(100vh - 160px)',
        boxSizing: 'border-box',
      }}
    >
      <AnimationFrame />
    </main>
  );
}
