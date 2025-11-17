// This component creates a wave shape that transitions from a light section to a dark one.
// It should be placed at the top of the dark section.
export default function InvertedWave() {
  return (
    <div className="absolute top-0 left-0 w-full h-24 md:h-32 lg:h-48" style={{ transform: 'translateY(-100%)' }}>
      <svg
        className="w-full h-full text-gray-50"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          // This is an inverted wave shape compared to the first one.
          d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
    </div>
  );
}
