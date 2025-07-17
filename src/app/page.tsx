'use client'
import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Grid,
  Box,
  Checkbox,
  Input,
  Divider,
  IconButton,
  Sheet,
  Skeleton,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Select,
  Option,
  Chip,
  Button,
  List,
  ListItem,
} from '@mui/joy'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import ProductCard from './components/ProductCard'
import { getCategories, getProducts, ProductItem } from './lib/wooApi'
import { CategoryItem } from './lib/wooApi'
import CategoryGrid from './components/CategoryGrid'
import 'keen-slider/keen-slider.min.css'
import Header from './components/Header'
import LoadingIndicator from './components/LoadingIndicator'
import { Alert, useMediaQuery } from '@mui/material'
import { ESTAMPADOS } from './lib/constants'
import ClearIcon from '@mui/icons-material/Clear'
import Head from 'next/head'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>()
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>()
  const [categories, setCategories] = useState<CategoryItem[]>()
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [selectedEstampados, setSelectedEstampados] = useState<string[]>([])
  const [isInStock, setIsInStock] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setIsLoading(true)
    getProducts().then((products) => setProducts(products))
    getCategories().then((categories) => setCategories(categories))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (categories) {
      setTimeout(() => {
        setSelectedCategory(categories[0])
      }, 1000)
    }
  }, [categories])

  useEffect(() => {
    setIsLoading(true)
    let filtered: ProductItem[] = []
    if (selectedCategory) {
      filtered = products?.filter((product) => 
        selectedCategory.parent.includes(product.parent) 
      && (isInStock ? product.stock > 0 : product.stock === 0)) || []
    }else{
      filtered = products?.filter((product) =>
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
  }, [selectedCategory, selectedEstampados, isInStock])

  if (!products || !categories) return <LoadingIndicator />

  const handleChangeEstampados = (
    event: React.SyntheticEvent | null,
    newValue: Array<string> | null,
  ) => {
    console.log(newValue)
    setSelectedEstampados(newValue || [])
  };

  return (
    <>
      <Head>
        <title>Sitio de compras Lubella</title>
        <meta name="description" content="Sitio de compras Lubella, productos de Lubella, productos de Lubella en México" />
        <link rel="icon" href="/imgs/favicon.png" />
      </Head>
      <Header />
      <Container>
        <CategoryGrid categories={categories} onCategoryChange={(category)=>{
          setSelectedCategory(category)
          setSelectedEstampados([])
        }} />

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
                    <Checkbox key={cat.name} label={cat.name} checked={selectedCategory?.name === cat.name} onChange={() => {
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
              <br />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDAHK2bOBOPCkynHhHwRqZMqHZTfyh4E-aA&s" />
             
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
              
              <Typography level="h3">Productos {selectedCategory?.name && `- ${selectedCategory?.name}`}</Typography>
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
                  <ProductCard product={product} viewMode={viewMode} />
                </Grid>
              ))}
            </Grid> : <List sx={{ width: '100%' }}>
              {filteredProducts?.map((product: ProductItem) => (
                <ListItem key={product.sku} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                  <ProductCard product={product} viewMode={viewMode} />
                  <Divider />
                </ListItem>
              ))}
            </List>}
          </Box>
        </Box>
      </Container>
    </>
  )
}