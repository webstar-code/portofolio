'use client'
import { motion, useInView } from 'framer-motion';
import { forwardRef, useEffect, useRef, useState } from 'react';

interface DataPoint {
  date: string,
  hours: number,
  minutes: number,
  decimal: number,
  text: string
}

export default function DailyCodingActivity() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [scrollPos, setScrollPos] = useState(-300);
  const [currentData, setCurrentData] = useState<DataPoint | null>(null);
  const [cursorVariant, setCursorVariant] = useState("default");
  const [scrollingContainer, setScrollingContainer] = useState({ height: 0, x: 0, y: 0 });
  const firstElementRef = useRef(null);
  const lastElementRef = useRef(null);
  const scrollingContainerRef = useRef<HTMLDivElement>(null);
  const isFirstInView = useInView(firstElementRef)
  const isEndInView = useInView(lastElementRef)

  useEffect(() => {
    const today = new Date();
    // Loop to generate dates going back 6 months
    let datesArray = [];
    for (let i = 0; i < 5; i++) {
      let year = today.getFullYear();
      let month = today.getMonth() - i;
      // Adjust the year and month if necessary
      if (month < 0) {
        month += 12;
        year--;
      }
      // Get the number of days in the month
      let daysInMonth = new Date(year, month + 1, 0).getDate();
      // Loop through each day of the month and add to the array
      for (let j = daysInMonth; j >= 1; j--) {
        datesArray.push(new Date(year, month, j));
      }
    }
    setData(datesArray.map((i) => {
      return ({ date: i.toLocaleDateString(), decimal: 0, hours: 0, minutes: 0, text: "" })
    }
    ).reverse());
  }, []);


  useEffect(() => {
    const handleScroll = (event: any) => {
      const scrollDir = event.deltaY < 1 ? 0 : 1;
      if (scrollDir) {
        if (isEndInView) return;
        setScrollPos((scrollPos) => scrollPos - 100)
      } else {
        if (isFirstInView) return;
        setScrollPos((scrollPos) => scrollPos + 100)
      }
    };
    if (scrollingContainerRef.current) {
      const { height, x, y } = scrollingContainerRef.current.getBoundingClientRect();
      setScrollingContainer({ height, x, y })
    }
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isFirstInView, isEndInView]);


  const barEntering = (data: DataPoint) => {
    setCurrentData(data);
    setCursorVariant("line")
  };
  const barExiting = () => {
    setCurrentData(null);
    setCursorVariant("default")
  };

  function normalize(value: number, min: number, max: number, newMin: number, newMax: number) {
    return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
  }

  return (
    <main className="w-full relative h-screen bg-background text-foreground overflow-hidden overflow-y-hidden pointer-events-auto">
      <Cursor variant={cursorVariant} containerMeta={scrollingContainer} >
        {cursorVariant === "line" && currentData &&
          <div className='absolute -top-10 left-6 -translate-x-1/2'>
            <p className='text-xs text-foreground/80 whitespace-nowrap'>{new Date(currentData.date).toLocaleDateString('en-US', { day: 'numeric', month: "short" })}</p>
            <p className='text-sm text-foreground whitespace-nowrap'>{currentData.text}</p>
          </div>
        }
      </Cursor>
      <div className="container h-full  bg-background text-foreground py-6 flex flex-col">
        <div className="w-[90%] mx-auto flex items-center justify-between">
          <h3 className="text-base text-foreground">daily coding activity</h3>
          <p>3023 hours since april 2020</p>
        </div>
        <div className="w-full h-full flex flex-col grow items-center justify-center">
          <motion.div
            ref={scrollingContainerRef}
            initial={{ x: -500 }}
            animate={{ x: scrollPos }}
            className="min-h-[256px] flex justify-start items-end border border-foreground">
            <div ref={firstElementRef}></div>
            {data.map((day, i) =>
              <div
                key={Date.now()}
                onMouseOver={() => barEntering(day)}
                onMouseLeave={() => barExiting()}
                className='h-full px-1 flex items-end'>
                <DayIndicator
                  height={normalize(day.decimal, 0, 5, 0, scrollingContainer.height)}
                  customRef={null}
                  dataPoint={day}
                  index={i}
                />
              </div>
            )}
            <div ref={lastElementRef}></div>
          </motion.div>
        </div>
      </div >
    </main >
  )
}

const Cursor = ({ variant, containerMeta, children }: { variant: string, containerMeta: { height: number, x: number, y: number }, children?: React.ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      // transition: {
      //   type: "spring",
      //   stiffness: 150,
      //   damping: 18,
      //   mass: .7,
      //   scale: {
      //     type: "spring",
      //     stiffness: 350,
      //     damping: 25
      //   }
      // }
    },
    line: {
      x: mousePosition.x,
      y: containerMeta.y,
      width: 2,
      height: containerMeta.height + 50,
      backgroundColor: "red"
    }
  }

  return (
    <motion.div
      className='absolute w-10 h-10 bg-foreground rounded-full pointer-events-none'
      animate={variant}
      variants={variants}>
      {children}
    </motion.div>
  );
};

const DayIndicator = forwardRef(({ customRef, dataPoint, height }: { customRef: any, dataPoint: DataPoint, height: number, index: number }) => {
  const date = new Date(dataPoint.date);
  return (
    <div
      ref={customRef}
      style={{ height: height || 40 }}
      className={`relative w-[1px] bg-foreground z-10`}>
      <div className={`absolute bottom-0 w-[1px] h-10 ${date.getDate() === 1 ? "bg-red" : "bg-foreground"} z-20`}></div>
      <div className={`absolute top-[105%] left-0 -translate-x-1/2`}>
        {date.getDate() == 1 &&
          <p className='text-xs text-foreground/75'>{date.toLocaleString('default', { month: 'short', year: '2-digit' })}</p>}
      </div>
    </div>
  )
})
DayIndicator.displayName = "DayIndicator";

