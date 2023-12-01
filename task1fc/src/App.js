import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const daysOfWeek = ['الحرم', 'مكة', 'منى', 'الجمرات', 'عرفات', 'مزدلفة'];

const App = () => {
  const [topCircles, setTopCircles] = useState(daysOfWeek);
  const [bottomCircles, setBottomCircles] = useState([]);
  const [middleCircles, setMiddleCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [showArrow, setShowArrow] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const moveCircle = (fromIndex, toIndex, source, destination) => {
    const sourceCircles = [...source];
    const destinationCircles = [...destination];
    
    const [removed] = sourceCircles.splice(fromIndex, 1);
    destinationCircles.splice(toIndex, 0, removed);
    
    if (source === topCircles) {
      setTopCircles(sourceCircles);
    } else if (source === bottomCircles) {
      setBottomCircles(sourceCircles);
    } else {
      setMiddleCircles(sourceCircles);
    }

    if (destination === topCircles) {
      setTopCircles(destinationCircles);
    } else if (destination === bottomCircles) {
      setBottomCircles(destinationCircles);
    } else {
      setMiddleCircles(destinationCircles);
    }
  };

  const Circle = ({ day, index, source }) => {
    const [, drag] = useDrag(() => ({
      type: 'circle',
      item: { day, index, source },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const [arrowStyle, setArrowStyle] = useState({
      position: 'absolute',
      width: 5,
      height: 5,
      borderRight: '20px solid black', // تعديل اللون هنا
      borderTop: '10px solid transparent',
      borderBottom: '10px solid transparent',
      left: '120%',
      top: '50%',
      transform: 'translate(-50%, -50%) rotate(180deg)',
      zIndex: 1,
      transition: 'left 2s',
      opacity: showArrow ? 1 : 0,
    });

    const [arrowTailStyle, setArrowTailStyle] = useState({
      position: 'absolute',
      width: 0,
      height: 0,
      borderRight: '10px solid black', // تعديل اللون هنا
      borderTop: '2px solid black',
      borderBottom: '2px solid black',
      left: '110%',
      top: '50%',
      transform: 'translate(-100%, -50%) rotate(180deg)',
      zIndex: 0,
      transition: 'left 2s',
      opacity: showArrow ? 1 : 0,
    });

    return (
      <div
        ref={drag}
        onClick={() => {
          setSelectedCircle(index);
          setShowArrow(true);
          setShowDatePicker(true);
          setArrowStyle({
              ...arrowStyle,
              left: '163%', // تغيير مكان السهم ليتحرك يمينا
            });
            setArrowTailStyle({
              ...arrowTailStyle,
              left: '125%',
              transform: 'scaleX(5)',
            });
        }}
        
        style={{
          opacity: 1,
          fontSize: 16,
          cursor: 'pointer',
          margin: 10,
          backgroundColor: 'white',
          width: 110,
          height: 110,
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '100px',
          position: 'relative',
        }}
      >
        {day}
        {selectedCircle === index && source === 'bottom' && showDatePicker && (
          <div
          
            style={{
              position: 'absolute',
              top: '120%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
            }}
          >
            <DatePicker selected={new Date()} />
          </div>
        )}
        {selectedCircle === index && source === 'bottom' && (
          <div style={arrowStyle}></div>
        )}
        {selectedCircle === index && source === 'bottom' && (
          <div style={arrowTailStyle}></div>
        )}
      </div>
    );
  };

  const DroppableArea = ({ circles, setCircles }) => {
    const [, drop] = useDrop(() => ({
      accept: 'circle',
      drop: (item) => {
        const { index, source } = item;
        if (source === 'top') {
          moveCircle(index, circles.length, topCircles, bottomCircles);
        } else if (source === 'bottom') {
          moveCircle(index, circles.length, bottomCircles, middleCircles);
        } else {
          moveCircle(index, circles.length, middleCircles, bottomCircles);
        }
      },
    }));

    return (
      <div
        ref={drop}
        style={{
          display: 'flex',
          justifyContent: 'flex-start', // تحديد بداية المنطقة من اليسار
          paddingLeft:' 20%',
          flexWrap: 'wrap',
          minHeight: 100,
          backgroundColor: '#a5cfe6',
          marginTop: 20,
          border: '1px solid #a5cfe6',
          textAlign: 'center',
          
        }}
      >
        {circles.map((day, index) => (
          <div key={index} style={{ margin: 10 }}>
            <Circle
              day={day}
              index={index}
              source={
                circles === topCircles
                  ? 'top'
                  : circles === bottomCircles
                  ? 'bottom'
                  : 'middle'
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{ backgroundColor: '#a5cfe6', minHeight: '100vh' }}>
        <Container>
          <Row>
            <Col>
              <DroppableArea circles={topCircles} setCircles={setTopCircles} />
            </Col>
          </Row>
          <Row>
            <Col>
              <DroppableArea circles={middleCircles} setCircles={setMiddleCircles} />
            </Col>
          </Row>
          <Row>
            <Col>

              <div style={{ borderTop: '2px solid gray', margin: '20px 0' }}></div>
      
              <DroppableArea circles={bottomCircles} setCircles={setBottomCircles} />
            </Col>
          </Row>
        </Container>
      </div>
    </DndProvider>
  );
};

export default App;
