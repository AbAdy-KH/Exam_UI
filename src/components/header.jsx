import "./header.css";

export function HeaderComponent({rightSection}) {
    return (
        <header className="nav">
            <div className="left-section"> 
                <a href="/home" className="nav-brand">
                    Bartihan
                </a>

            </div>

            <div className="right-section">
                {rightSection}
            </div>
        </header>
    );
}