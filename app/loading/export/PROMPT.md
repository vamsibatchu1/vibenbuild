# Integration Prompt for AI Agent

**Task:** Integrate the provided loading animation sequence into this Next.js project.

**Context:** 
The `LoadingSequence.tsx` file contains a high-fidelity welcome animation that includes a symbol cycle, a appearing landing image, and a typewriter effect description of the user.

**Steps for the AI Agent:**
1. **Copy Assets:** Move the `images` folder from the `public` directory in the `export` package into your project's `public/images` directory. Ensure the structure `public/images/refresh-images/` and `public/images/port/` is maintained.
2. **Setup Component:** Place `LoadingSequence.tsx` in your components or app directory.
3. **Install Dependencies:** Ensure `framer-motion` and `next/font` are installed and configured in the project.
4. **Integration:** 
   - Set this component as the initial view in your `layout.tsx` or `page.tsx`.
   - The component handles its own timing and state. 
   - Once the animation sequence is complete (typing finished), it attempts to route to `/home`. You can adjust the `router.push('/home')` destination in the `useEffect` at the bottom of the component if your home route is different.
5. **Aesthetics:** Do not modify the styling, as it is carefully crafted for a premium feel with specific font weights (Plus Jakarta Sans) and timing.

**Note:** The font `Plus_Jakarta_Sans` is imported from `next/font/google` within the component file to ensure it works out-of-the-box.
