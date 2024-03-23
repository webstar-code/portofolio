'use client'
import { motion, useInView } from 'framer-motion';
import React, { memo, useEffect, useRef, useState } from 'react';
export interface DataPoint {
  date: string,
  decimal: number,
  text: string
}

export default function DailyCodingActivity() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [scrollPos, setScrollPos] = useState(-500);
  const [currentData, setCurrentData] = useState<DataPoint | null>(null);
  const [cursorVariant, setCursorVariant] = useState("default");
  const [scrollingContainer, setScrollingContainer] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const firstElementRef = useRef(null);
  const lastElementRef = useRef(null);
  const scrollingContainerRef = useRef<HTMLDivElement>(null);
  const isFirstInView = useInView(firstElementRef)
  const isEndInView = useInView(lastElementRef)
  const [dataPoints, setDataPoints] = useState<{ [key: string]: DataPoint }>({});
  const [maxDecimal, setMaxDecimal] = useState(0);
  const [allTimeText, setAllText] = useState("");
  let clickAudio = new Audio("/click.mp3")

  useEffect(() => {
    fetch("/api/all-time")
      .then(res => res.json())
      .then((res) => {
        const result = res.data
        const startDate = new Date(result.start_date).toLocaleString('default', { month: 'long', year: 'numeric' });
        setAllText(`${(result.total_seconds / 3600).toFixed()} hours since ${startDate}`)
      })
    fetch("/api/daily")
      .then(res => res.json())
      .then((res) => {
        const result = res.data
        const decimals = result.map((d: any) => Number(d.data.decimal));
        const max = Math.max(...decimals);
        setMaxDecimal(max * 1.5)
        let obj = {};
        result.forEach((doc: any) =>
          // @ts-ignore 
          obj[`${new Date(doc.data.date).toLocaleDateString()}`] = {
            date: new Date(doc.data.date).toLocaleDateString(),
            decimal: Number(doc.data.decimal),
            text: doc.data.text,
          }
        )
        setDataPoints(obj);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    const today = new Date();
    let datesArray = [];
    for (let i = 0; i < 12; i++) {
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
      return ({ date: i.toLocaleDateString(), decimal: 0, text: "0 secs" })
    }).reverse());
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
      const { width, height, x, y } = scrollingContainerRef.current.getBoundingClientRect();
      setScrollingContainer({ width, height, x, y })
    }
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isFirstInView, isEndInView]);

  const barEntering = (data: DataPoint) => {
    setCurrentData(data);
    clickAudio.play();
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
    <main className="w-full relative h-screen bg-background text-foreground overflow-hidden overflow-y-hidden pointer-events-auto cursor-none">
      <Cursor variant={cursorVariant} containerMeta={scrollingContainer} >
        {cursorVariant === "line" && currentData &&
          <div className='absolute -top-10 left-6 -translate-x-1/2'>
            <p className='text-xs text-foreground/80 whitespace-nowrap'>{new Date(currentData.date).toLocaleDateString('en-US', { day: 'numeric', month: "short" })}</p>
            <p className='text-sm text-foreground whitespace-nowrap'>{currentData.text}</p>
          </div>
        }
      </Cursor>
      <div className="container h-full bg-background text-foreground py-6 flex flex-col">
        <div className="w-[90%] mx-auto flex items-center justify-between">
          <h3 className="text-base text-foreground">daily coding activity</h3>
          <p className='text-sm lowercase'>{allTimeText}</p>
        </div>
        <div className="relative w-full h-full flex flex-col grow items-end justify-center">
          <div className='bg-gradient-to-l from-background w-20 h-full fixed z-30 right-0 flex items-center'>
            <div className='w-full h-[230px] flex flex-col justify-between items-end'>
              {[...new Array(4)].map((_, index) =>
                <div key={index} className='text-foreground/50 text-xs px-2'>
                  {index != (4 - 1) ? `${Math.floor(maxDecimal / 4) * (4 - index - 1)}-` : null}
                </div>
              )}
            </div>
          </div>

          <motion.div
            ref={scrollingContainerRef}
            animate={{ x: scrollPos }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 18,
              mass: .7,
              scale: {
                type: "spring",
                stiffness: 350,
                damping: 25
              }
            }}
            className="h-[256px] flex justify-start items-end">
            <div ref={firstElementRef}></div>
            {data.map((day, i) =>
              <div
                key={i}
                onMouseOver={() => barEntering(dataPoints[day.date as string] || day)}
                onMouseLeave={() => barExiting()}
                className='h-full px-1 flex items-end'>
                <DayIndicator
                  height={normalize(dataPoints[day.date as string]?.decimal || 0, 0, maxDecimal, 0, scrollingContainer.height)}
                  dataPoint={dataPoints[day.date as string] || day}
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
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 10,
        mass: .7,
        scale: {
          type: "spring",
          stiffness: 350,
          damping: 25
        }
      }
    },
    line: {
      x: mousePosition.x,
      y: containerMeta.y,
      width: 2,
      height: containerMeta.height + 50,
      backgroundColor: "rgba(231, 0, 0, 1)"
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

const DayIndicator = memo(({ dataPoint, height = 0 }: { dataPoint: DataPoint, height: number }) => {
  const date = new Date(dataPoint.date);
  console.log(height)
  return (
    <div
      key={dataPoint.date}
      style={{ height: height + 20 }}
      className={`relative w-[1px] ${height + 20 > 20 ? "bg-foreground" : "bg-foreground/50"} z-10`}>
      <div className={`absolute bottom-0 w-[1px] h-5 ${date.getDate() === 1 ? "bg-red" : "bg-none"} z-20`}></div>
      <div className={`absolute top-[105%] left-0 -translate-x-1/2`}>
        {date.getDate() == 1 &&
          <p className='text-xs text-center text-foreground/75'>{date.toLocaleString('default', { month: 'short', year: '2-digit' })}</p>}
      </div>
    </div>
  )
})
DayIndicator.displayName = "DayIndicator";

