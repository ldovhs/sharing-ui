import s from "/sass/home/home.module.css";
/**
 * The main navbar for the website.
 * @returns 
 */
export default function Navbar() {
    return (
        <div className={s.nav_menu}>
            <div>
                <img src="/img/home/logos/menu_logo.png" alt="" className={s.nav_logo} />
            </div>
            <div className={s.nav_list}>
                <a to="/" className={s.nav_item}>Home</a>
                <a to="/wallet" className={s.nav_item}>Wallet</a>
            </div>
            <div className={s.nav_icons}>
                <i className="nes-icon instagram is-medium"></i>
                <i className="nes-icon linkedin is-medium"></i >
                <i className="nes-icon medium is-medium"></i >
            </div >
        </div >
    )
}
