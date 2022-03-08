import s from "/sass/admin/admin.module.css";
import Link from "next/link";
/**
 * The main navbar for the website.
 * @returns
 */
export default function AdminNavbar() {
    return (
        <nav className={s.navbar_zone}>
            <div className={s.navbar_container}>
                <Link href="/admin">
                    <a>Home</a>
                </Link>
                <Link href="/admin/rewards">
                    <a>Rewards</a>
                </Link>
                <Link href="/admin/search">
                    <a>Search</a>
                </Link>
            </div>
        </nav>
    );
}
