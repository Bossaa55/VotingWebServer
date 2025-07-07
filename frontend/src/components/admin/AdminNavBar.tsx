

export const AdminNavBar = ({ onBack } : { onBack: () => void }) => {
    return (
        <div className="bg-nav h-16 p-2 fixed top-0 left-0 right-0 z-50 grid items-center">
            <div className="container mx-auto flex justify-between items-center">
                <button onClick={onBack} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                    </svg>
                </button>
            </div>
        </div>
    );
}