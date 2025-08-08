'use client'
import { useEffect, useState } from 'react'
import {
    Container,
    Typography,
    Grid,
    Box,
    Checkbox,
    Divider,
    IconButton,
    Sheet,
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Select,
    Option,
    Chip,
    Button,
    List,
    ListItem,
    Modal,
} from '@mui/joy'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import ProductCard from '../../../components/ProductCard'
import { getCategories, ProductItem } from '../../../lib/wooApi'
import { CategoryItem } from '../../../lib/wooApi'
import CategoryGrid from '../../../components/CategoryGrid'
import 'keen-slider/keen-slider.min.css'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { Alert, useMediaQuery } from '@mui/material'
import { ESTAMPADOS } from '../../../lib/constants'
import ClearIcon from '@mui/icons-material/Clear'
import { useProducts } from '@/context/ProductContext'
import { TableChartOutlined } from '@mui/icons-material'

interface MainViewProps {
    selectedProduct?: string
}

export default function MainView({ selectedProduct }: MainViewProps) {
    const { products, loaded } = useProducts()
    const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>()
    const [categories, setCategories] = useState<CategoryItem[]>()
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const isMobile = useMediaQuery('(max-width: 600px)')
    const [selectedEstampados, setSelectedEstampados] = useState<string[]>([])
    const [isInStock, setIsInStock] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showTable, setShowTable] = useState(false)



    useEffect(() => {
        getCategories().then((categories) => setCategories(categories))
    }, [])


    useEffect(() => {
        if (categories && products && selectedProduct) {
            console.log(categories.find((category) => category.slug == selectedProduct))
            setSelectedCategory(categories.find((category) => category.slug == selectedProduct) || categories[0])
        } else {
            setSelectedCategory(categories?.[0] || null)
        }
    }, [categories, products, selectedProduct])

    useEffect(() => {
        if (products) {
            setIsLoading(true)
            let filtered: ProductItem[] = []
            if (selectedCategory) {
                filtered = products?.filter((product: ProductItem) =>
                    selectedCategory.parent.includes(product.parent)
                    && (isInStock ? product.stock > 0 : product.stock === 0)) || []
            } else {
                filtered = products?.filter((product: ProductItem) =>
                    (isInStock ? product.stock > 0 : product.stock === 0)) || []
            }
            if (selectedEstampados.length > 0 && filtered) {
                const filteringProducts = selectedEstampados.map((estampado) => filtered?.filter((product) => product.name.includes(estampado)))
                setFilteredProducts(filteringProducts.flat().filter((product) => product !== undefined))
            } else {
                setFilteredProducts(filtered)
            }
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [selectedCategory, selectedEstampados, isInStock, products])

    if (!categories || !products || !loaded) return <LoadingIndicator isFullScreen={true} />

    const checkDiscount = (product: ProductItem) => {
        return categories.find((category) => category.name.includes(product.parent_name))?.discount || 0

    }
    const handleChangeEstampados = (
        event: React.SyntheticEvent | null,
        newValue: Array<string> | null,
    ) => {
        console.log(newValue)
        setSelectedEstampados(newValue || [])
    };

    return (
        <Container>
            <CategoryGrid categories={categories} onCategoryChange={(category) => {
                setSelectedCategory(category)
                setSelectedEstampados([])
            }} />
            <Typography level="h3" sx={{ mt: 2, textAlign: 'center', color: '#e8416c' }}>Productos {selectedCategory?.name && `- ${selectedCategory?.name}`}</Typography>
            {
                selectedCategory?.slug == "calzon-menstrual" && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button startDecorator={<TableChartOutlined />} color="primary" variant="solid" sx={{ mt: 2, textAlign: 'center' }} onClick={() => setShowTable(true)}>Consulta la tabla de tallas</Button>
                    </Box>
                )
            }


            <Box sx={{ display: 'flex', gap: 4, mt: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* Filtros laterales */}
                <Box sx={{ width: { xs: '100%', sm: 180 }, display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <Accordion sx={{ mb: 2, width: '100%' }} defaultExpanded={!isMobile}>
                        <AccordionSummary>
                            <Typography level="h3" sx={{ mb: 1 }}>
                                Filtros
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography level="body-sm" sx={{ mt: 2, mb: 1 }}>
                                Categorías
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Checkbox label="Todas" checked={selectedCategory === null} onChange={() => {
                                    setSelectedCategory(null)
                                    setSelectedEstampados([])
                                }} />
                            </Box>
                            {categories.map((cat) => (
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }} key={cat.name}>
                                    <Checkbox label={cat.name} checked={selectedCategory?.name === cat.name} onChange={() => {
                                        setSelectedCategory(cat)
                                        setSelectedEstampados([])
                                    }} />
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography level="body-sm" sx={{ mt: 2, mb: 1 }}>
                                    Estampados
                                </Typography>
                                {selectedEstampados.length > 0 && <IconButton variant="soft" color="danger" size="sm" onClick={() => setSelectedEstampados([])} sx={{ ml: 1, fontSize: '0.3rem' }}>
                                    <ClearIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>}
                            </Box>
                            <Select
                                value={selectedEstampados}
                                multiple
                                onChange={handleChangeEstampados}
                                slotProps={{
                                    listbox: {
                                        sx: {
                                            width: '100%',
                                        },
                                    },
                                    button: {
                                        sx: {
                                            // Permite que el botón crezca con el contenido
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            minHeight: 'auto',
                                        },
                                    },
                                }}
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'flex-start',
                                            width: '100%',
                                            padding: '0'
                                        }}
                                    >
                                        {selected.map((selectedOption) => (
                                            <Chip key={selectedOption.value} variant="soft" color="primary" sx={{ mr: 0.5, mb: 0.5 }}>
                                                {selectedOption.label}
                                            </Chip>
                                        ))}
                                    </Box>
                                )}
                            >
                                {ESTAMPADOS.map((estampado) => (
                                    <Option key={estampado} value={estampado}>
                                        {estampado}
                                    </Option>
                                ))}
                            </Select>


                            <Divider sx={{ my: 2 }} />



                            <Typography level="body-sm" sx={{ mb: 1 }}>
                                Disponibilidad
                            </Typography>
                            <Checkbox label="En stock" checked={isInStock} onChange={() => setIsInStock(true)} />
                            <Checkbox label="Sin stock" checked={!isInStock} onChange={() => setIsInStock(false)} />
                        </AccordionDetails>

                    </Accordion>



                </Box>

                {/* Vista de productos */}
                <Box sx={{ flex: 1 }}>
                    {/* Controles de vista */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton variant={viewMode === 'grid' ? 'outlined' : 'soft'} size="sm" onClick={() => setViewMode('grid')}>
                                <ViewModuleIcon />
                            </IconButton>
                            <IconButton variant={viewMode === 'list' ? 'outlined' : 'soft'} size="sm" onClick={() => setViewMode('list')}>
                                <ViewListIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    {!isLoading && filteredProducts?.length === 0 && <Alert severity="warning">No se encontraron productos con los filtros aplicados</Alert>}

                    {viewMode === 'grid' ? <Grid container spacing={2}>
                        {isLoading ? <LoadingIndicator /> : filteredProducts?.map((product: ProductItem) => (
                            <Grid xs={12} sm={4} key={product.sku}>
                                <ProductCard product={product} viewMode={viewMode} discount={checkDiscount(product)} />
                            </Grid>
                        ))}
                    </Grid> : <List sx={{ width: '100%' }}>
                        {filteredProducts?.map((product: ProductItem) => (
                            <ListItem key={product.sku} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                <ProductCard product={product} viewMode={viewMode} discount={checkDiscount(product)} />
                                <Divider />
                            </ListItem>
                        ))}
                    </List>}
                </Box>
            </Box>
            {showTable &&
                <Modal open={showTable} onClose={() => setShowTable(false)}>
                    <Sheet
                        sx={{
                            width: { xs: '100%', sm: 500 },
                            mx: 'auto',
                            mt: '3vh',
                            borderRadius: 'md',
                            p: 4,
                            boxShadow: 'lg',
                            bgcolor: 'background.body',
                            outline: 'none',
                            textAlign: 'center',
                        }}
                    >
                        <img
                            src="/imgs/guia.jpg"
                            alt="Tabla de tallas"
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                        />
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => setShowTable(false)}
                            sx={{ mt: 3 }}
                        >
                            Cerrar
                        </Button>
                    </Sheet>
                </Modal>
            }
        </Container>
    )
}