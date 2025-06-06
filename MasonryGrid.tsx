import { useEffect, useState } from "react"
import { motion, Variants } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import React from "react"

// Custom Hook to get the current screen width
function useBreakpoint() {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return width
}

export default function MasonryLayout(props) {
    const {
        animate,
        gutter,
        vgutter,
        gallery,
        mediaQuerySmall,
        mediaQueryMedium,
        columnsSmall,
        columnsMedium,
        columnsBig,
        style,
    } = props

    const images = gallery[0]?.props?.children || []
    const [columnsNum, setColumnsNum] = useState(columnsBig)
    const width = useBreakpoint()

    useEffect(() => {
        if (width >= mediaQueryMedium) {
            setColumnsNum(columnsBig) // Desktop
        } else if (width >= mediaQuerySmall) {
            setColumnsNum(columnsMedium) // Tablet
        } else {
            setColumnsNum(columnsSmall) // Phone
        }
    }, [
        width,
        mediaQuerySmall,
        mediaQueryMedium,
        columnsSmall,
        columnsMedium,
        columnsBig,
    ])

    const cardVariants: Variants = {
        offscreen: {
            scale: animate ? 0.5 : 1,
        },
        onscreen: {
            scale: 1,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8,
            },
        },
    }

    return (
        <motion.div style={{ ...style, ...containerStyle }}>
            <style>{masonryStyle}</style>
            <motion.div
                className="masonry-with-flex"
                style={{ columnGap: gutter, columnCount: columnsNum }}
            >
                {React.Children.map(images, (child, index) => (
                    <motion.figure
                        layout={animate}
                        variants={cardVariants}
                        initial={animate ? "offscreen" : false}
                        whileInView={animate ? "onscreen" : "offscreen"}
                        viewport={animate ? { once: true, amount: 0.8 } : {}}
                        style={{ ...figureStyle, marginBottom: vgutter }}
                    >
                        {React.cloneElement(child, {
                            width: "100%",
                            key: index,
                        })}
                    </motion.figure>
                ))}
            </motion.div>
        </motion.div>
    )
}

MasonryLayout.defaultProps = {
    gutter: 10,
    columns: 4,
}

addPropertyControls(MasonryLayout, {
    gallery: {
        title: "Gallery",
        type: ControlType.Array,
        control: {
            type: ControlType.ComponentInstance,
        },
        maxCount: 16,
    },
    animate: {
        title: "Animate",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    gutter: {
        title: "Gap",
        type: ControlType.Number,
        defaultValue: 10,
    },
    vgutter: {
        title: "Vertical Gap",
        type: ControlType.Number,
        defaultValue: 10,
    },
    mediaQuerySmall: {
        title: "Media Query Small",
        type: ControlType.Number,
        defaultValue: 810,
    },
    mediaQueryMedium: {
        title: "Media Query Medium",
        type: ControlType.Number,
        defaultValue: 1200,
    },
    columnsSmall: {
        title: "Columns Small",
        type: ControlType.Number,
        defaultValue: 2,
    },
    columnsMedium: {
        title: "Columns Medium",
        type: ControlType.Number,
        defaultValue: 3,
    },
    columnsBig: {
        title: "Columns Big",
        type: ControlType.Number,
        defaultValue: 6,
    },
})

const containerStyle = {
    padding: 8,
    width: "100%",
    minWidth: 390,
    height: "100%",
    boxSizing: "border-box",
}

const figureStyle: React.CSSProperties = {
    margin: 0,
    display: "grid",
    gridTemplateRows: "1fr auto",
    breakInside: "avoid",
}

const masonryStyle = `
.masonry-with-flex {
  column-count: 4;
  column-gap: 10px;
}
figure > div {
  max-width: 100%;
  display: block;
}
figure > img {
  grid-row: 1 / -1;
  grid-column: 1;
}
`
