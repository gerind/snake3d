import React from 'react'

const styles: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  border: '10px solid black',
  borderRadius: '100%',
  fontSize: '42px',
  fontWeight: 'bold',
}

const NoMobile: React.FC = () => {
  return <div style={styles}>Недоступно на мобильных устройствах</div>
}

export default NoMobile
