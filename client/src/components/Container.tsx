interface ContainerProps{
    children : React.ReactNode
}


const Container = ({children}: ContainerProps) => {
  return (
    <div className="mx-[20%] my-10 flex items-center justify-center">
        {children}
    </div>
  )
}

export default Container