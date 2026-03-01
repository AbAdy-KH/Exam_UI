import "./header.css";

export function HeaderComponent({rightSection}) {
    return (
        <header className="nav">
            <a href="/home" className="nav-brand">
                Bartihan
            </a>

            {rightSection}
        </header>
    );
}