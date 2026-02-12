/**
 * 🏔️ Zenith Layout Logic (.koda)
 * This runs for the entire experiments/ directory.
 */
export async function load({ request }) {
    console.log("🏔️ Zenith: Experiments Layout Loader Active");
    return {
        layoutMsg: "Welcome to the Laboratories",
        scope: "experiments"
    };
}
