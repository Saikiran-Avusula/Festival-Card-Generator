// Card Generator - Canvas-based image generation

export class CardGenerator {
    async generate({ festivalImageUrl, businessData, format, bannerConfig, imageTransform = { scale: 1, x: 0, y: 0 } }) {
        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d', { alpha: false })

            canvas.width = 1080
            canvas.height = format === 'square' ? 1080 : 1920

            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            await this.drawFestivalImageContain(ctx, festivalImageUrl, canvas.width, canvas.height, imageTransform)
            await this.drawBanner(ctx, businessData, bannerConfig, canvas.width, canvas.height, format)

            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed to create blob')), 'image/png', 1.0)
            })

            if (!blob || blob.size === 0) throw new Error('Generated blob is empty')

            const url = URL.createObjectURL(blob)
            return { blob, url, canvas }
        } catch (error) {
            console.error('Card generation error:', error)
            throw error
        }
    }

    async drawFestivalImageContain(ctx, imageUrl, canvasWidth, canvasHeight, transform) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'

            img.onload = () => {
                try {
                    const scaleX = canvasWidth / img.width
                    const scaleY = canvasHeight / img.height
                    const baseScale = Math.min(scaleX, scaleY)

                    const scaledWidth = img.width * baseScale
                    const scaledHeight = img.height * baseScale
                    const baseX = (canvasWidth - scaledWidth) / 2
                    const baseY = (canvasHeight - scaledHeight) / 2

                    if (transform && (transform.scale !== 1 || transform.x !== 0 || transform.y !== 0)) {
                        ctx.save()
                        const centerX = canvasWidth / 2
                        const centerY = canvasHeight / 2
                        ctx.translate(centerX, centerY)
                        ctx.scale(transform.scale, transform.scale)
                        const scaleFactor = canvasWidth / 300
                        ctx.translate(transform.x * scaleFactor, transform.y * scaleFactor)
                        ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)
                        ctx.restore()
                    } else {
                        ctx.drawImage(img, baseX, baseY, scaledWidth, scaledHeight)
                    }
                    resolve()
                } catch (error) {
                    reject(error)
                }
            }

            img.onerror = () => {
                if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
                    const img2 = new Image()
                    img2.onload = () => {
                        const scaleX = canvasWidth / img2.width
                        const scaleY = canvasHeight / img2.height
                        const scale = Math.min(scaleX, scaleY)
                        const w = img2.width * scale
                        const h = img2.height * scale
                        ctx.drawImage(img2, (canvasWidth - w) / 2, (canvasHeight - h) / 2, w, h)
                        resolve()
                    }
                    img2.onerror = reject
                    img2.src = imageUrl
                } else {
                    reject(new Error('Failed to load festival image'))
                }
            }

            img.src = imageUrl
        })
    }

    async drawBanner(ctx, businessData, bannerConfig, canvasWidth, canvasHeight, format) {
        const { style, position, colors } = bannerConfig

        let bannerHeight
        if (format === 'portrait') {
            bannerHeight = style === 'poster' ? 280 : style === 'minimal' ? 160 : 230
        } else {
            bannerHeight = style === 'poster' ? 260 : style === 'minimal' ? 120 : 195
        }

        const bannerY = position === 'top' ? 0 : canvasHeight - bannerHeight

        ctx.fillStyle = colors.background
        ctx.fillRect(0, bannerY, canvasWidth, bannerHeight)

        if (style === 'poster') {
            await this.drawPosterBanner(ctx, businessData, colors, bannerY, canvasWidth, bannerHeight, format)
        } else if (style === 'minimal') {
            await this.drawMinimalBanner(ctx, businessData, colors, bannerY, canvasWidth, bannerHeight, format)
        } else {
            await this.drawClassicBanner(ctx, businessData, colors, bannerY, canvasWidth, bannerHeight, format)
        }
    }

    async drawClassicBanner(ctx, business, colors, y, width, height, format) {
        ctx.fillStyle = colors.text
        ctx.textBaseline = 'middle'

        const logoSize = format === 'portrait' ? 90 : 110
        let textX = 50

        if (business.logo) {
            try {
                await this.drawLogo(ctx, business.logo, { x: 40, y: y + (height - logoSize) / 2, size: logoSize, circular: true })
                textX = 40 + logoSize + 25
            } catch (e) { console.warn('Logo draw failed:', e) }
        }

        const centerY = y + height / 2
        const nameSize = format === 'portrait' ? 38 : 46
        const phoneSize = format === 'portrait' ? 28 : 34

        ctx.font = `bold ${nameSize}px Poppins, Arial, sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(this.truncateText(business.name, 30), textX, centerY - nameSize * 0.6)

        ctx.font = `${phoneSize}px Inter, Arial, sans-serif`
        ctx.fillText(`📞 ${business.phone}`, textX, centerY + phoneSize * 0.3)
    }

    async drawPosterBanner(ctx, business, colors, y, width, height, format) {
        ctx.fillStyle = colors.text
        const centerX = width / 2
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const logoSize = format === 'portrait' ? 100 : 120
        let startY = y + 50

        if (business.logo) {
            try {
                await this.drawLogo(ctx, business.logo, { x: centerX - logoSize / 2, y: y + 25, size: logoSize, circular: true })
                startY = y + 25 + logoSize + 15
            } catch (e) { console.warn('Logo draw failed:', e) }
        }

        const nameSize = format === 'portrait' ? 40 : 48
        const phoneSize = format === 'portrait' ? 30 : 36

        ctx.font = `bold ${nameSize}px Poppins, Arial, sans-serif`
        ctx.fillText(this.truncateText(business.name, 26), centerX, startY)

        ctx.font = `${phoneSize}px Inter, Arial, sans-serif`
        ctx.fillText(`📞 ${business.phone}`, centerX, startY + nameSize * 0.9)
    }

    async drawMinimalBanner(ctx, business, colors, y, width, height, format) {
        ctx.fillStyle = colors.text
        const centerX = width / 2
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const centerY = y + height / 2

        const nameSize = format === 'portrait' ? 34 : 40
        const phoneSize = format === 'portrait' ? 26 : 30

        ctx.font = `bold ${nameSize}px Poppins, Arial, sans-serif`
        ctx.fillText(this.truncateText(business.name, 30), centerX, centerY - nameSize * 0.35)

        ctx.font = `${phoneSize}px Inter, Arial, sans-serif`
        ctx.globalAlpha = 0.85
        ctx.fillText(`${business.phone}`, centerX, centerY + phoneSize * 0.5)
        ctx.globalAlpha = 1.0
    }

    async drawLogo(ctx, logoUrl, { x, y, size, circular }) {
        return new Promise((resolve, reject) => {
            const logo = new Image()
            logo.crossOrigin = 'anonymous'

            logo.onload = () => {
                if (circular) {
                    ctx.save()
                    ctx.beginPath()
                    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                    ctx.clip()
                }
                ctx.drawImage(logo, x, y, size, size)

                if (circular) {
                    ctx.restore()
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                    ctx.stroke()
                }
                resolve()
            }

            logo.onerror = () => {
                if (logoUrl.startsWith('data:') || logoUrl.startsWith('blob:')) {
                    const logo2 = new Image()
                    logo2.onload = () => {
                        if (circular) {
                            ctx.save()
                            ctx.beginPath()
                            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                            ctx.clip()
                        }
                        ctx.drawImage(logo2, x, y, size, size)
                        if (circular) ctx.restore()
                        resolve()
                    }
                    logo2.onerror = reject
                    logo2.src = logoUrl
                } else {
                    reject(new Error('Failed to load logo'))
                }
            }

            logo.src = logoUrl
        })
    }

    truncateText(text, maxLength) {
        if (!text) return ''
        return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text
    }
}

export const cardGenerator = new CardGenerator()
