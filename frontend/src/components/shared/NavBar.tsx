

export const NavBar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-16 p-2 bg-nav">
            <div className="container flex items-center justify-between mx-auto">
                <img src='/img/logo_ajt_pa.png' alt="Logo" className="w-auto h-12" /> 
                <img src='/img/logo_juventut.svg' alt="Logo" className="w-12 h-12" /> 
            </div>  
        </div>
    );
}