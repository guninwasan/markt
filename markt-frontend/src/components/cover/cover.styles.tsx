// leftcontainer.styles.tsx

export const coverContainerStyles = {
    display: 'flex',
    width: '55vw',
    height: '91vh', // Set the height to 100% of the viewport
    // padding: '185px 116px', // Adjust padding to prevent overflow (removed bottom padding)
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const, // Center content vertically
    flexShrink: 0,
    background: '#B6B6B6',
    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden', // Ensure no overflow to prevent scrolling
  };

  export const rightContainerStyles = {
    display: 'flex',
    width: '45vw', // Take up the remaining part of the viewport width
    height: '91vh', // Same height as the left container
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
    alignItems: 'flex-start' as const, // Align items to the left
    padding: '0 3rem', // Add padding for the inputs and text
    boxSizing: 'border-box' as const, // Ensure padding is inside the box
    background: '#FFFFFF', // Assuming a white background for the right side
    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  };
  
  export const titleStyles = {
    color: '#000',
    fontFamily: 'Inter, sans-serif', // Ensure Inter is available in your project
    fontSize: '48px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 'normal',
    textDecorationLine: 'underline',
    marginLeft: '31.56rem',
    marginRight: '7.25rem',
    marginTop: '11.56rem',
    marginBottom: 'auto',
  };
  
  export const subtitleStyles = {
    fontSize: '2rem',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 'normal',
    marginLeft: '31.56rem',
    marginRight: '1rem',
    marginTop: 'auto',
    marginBottom: 'auto',
    color: "#4D4D4D",
  };
  