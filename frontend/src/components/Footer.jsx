export default function Footer() {
    return (
        <>
            <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-lg font-semibold text-white mb-2">MyShop</p>
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} MyShop. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    )
}