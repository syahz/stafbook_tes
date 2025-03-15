import type React from "react"
import { useState, useRef } from "react"
import { Trash2, Upload, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { useToast } from "@/hooks/use-toast"


type Category = {
  id: string
  name: string
  image: string | null
}

type Product = {
  id: string
  name: string
  categories: Category[]
}

export default function ProductManagementSystem() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Obat",
      categories: [{ id: "1-1", name: "Obat Batuk", image: "/placeholder.svg?height=80&width=60" }],
    },
  ])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{ productId: string; categoryId: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeUpload, setActiveUpload] = useState<{ productId: string; categoryId: string } | null>(null)

  const addProduct = () => {
    if (products.length >= 5) {
      toast({
        title: "Anda Sudah Mencapai Maksimum Input",
        description: "Maksimum produk yang dapat ditambahkan adalah 5 produk.",
        variant: "destructive",
      })
      return
    }

    const newProduct = {
      id: (products.length + 1).toString(),
      name: "",
      categories: [{ id: `${products.length + 1}-1`, name: "", image: null }],
    }

    setProducts([...products, newProduct])
  }

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter((product) => product.id !== productId)

    const renumberedProducts = updatedProducts.map((product, index) => ({
      ...product,
      id: (index + 1).toString(),
      categories: product.categories.map((category, catIndex) => ({
        ...category,
        id: `${index + 1}-${catIndex + 1}`,
      })),
    }))

    setProducts(renumberedProducts)
  }

  const addCategory = (productId: string) => {
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) return

    if (products[productIndex].categories.length >= 3) {
      toast({
        title: "Anda Sudah Mencapai Maksimum Input",
        description: "Maksimum kategori yang dapat ditambahkan adalah 3 kategori per produk.",
        variant: "destructive",
      })
      return
    }

    const updatedProducts = [...products]
    updatedProducts[productIndex].categories.push({
      id: `${productId}-${updatedProducts[productIndex].categories.length + 1}`,
      name: "",
      image: null,
    })

    setProducts(updatedProducts)
  }

  const deleteCategory = (productId: string, categoryId: string) => {
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) return

    if (products[productIndex].categories.length <= 1) {
      toast({
        description: "Produk harus memiliki minimal satu kategori.",
        variant: "destructive",
      })
      return
    }

    const updatedProducts = [...products]
    updatedProducts[productIndex].categories = updatedProducts[productIndex].categories
      .filter((cat) => cat.id !== categoryId)
      .map((cat, index) => ({
        ...cat,
        id: `${productId}-${index + 1}`,
      }))

    setProducts(updatedProducts)
  }

  const updateProductName = (productId: string, name: string) => {
    const updatedProducts = products.map((product) => (product.id === productId ? { ...product, name } : product))
    setProducts(updatedProducts)
  }

  const updateCategoryName = (productId: string, categoryId: string, name: string) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          categories: product.categories.map((category) =>
            category.id === categoryId ? { ...category, name } : category,
          ),
        }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeUpload || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast({
        title: "Format file tidak didukung",
        description: "Hanya file JPG, JPEG, dan PNG yang diperbolehkan.",
        variant: "destructive",
      })
      return
    }

    const imageUrl = URL.createObjectURL(file)

    const { productId, categoryId } = activeUpload
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          categories: product.categories.map((category) =>
            category.id === categoryId ? { ...category, image: imageUrl } : category,
          ),
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setActiveUpload(null)
  }

  const triggerFileInput = (productId: string, categoryId: string) => {
    setActiveUpload({ productId, categoryId })
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const openDeleteImageDialog = (productId: string, categoryId: string) => {
    setImageToDelete({ productId, categoryId })
    setShowDeleteDialog(true)
  }

  const deleteImage = () => {
    if (!imageToDelete) return

    const { productId, categoryId } = imageToDelete
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          categories: product.categories.map((category) =>
            category.id === categoryId ? { ...category, image: null } : category,
          ),
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setShowDeleteDialog(false)
    setImageToDelete(null)
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">

              <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-800">Tes Soal</span>
          </h1>
        </div>

        <div className="bg-white border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 w-16 text-center">No</th>
                <th className="border border-gray-300 p-3 w-1/5">Produk</th>
                <th className="border border-gray-300 p-3 w-1/3">Deskripsi Produk</th>
                <th className="border border-gray-300 p-3 w-1/3">Gambar Produk</th>
                <th className="border border-gray-300 p-3 w-24 text-center">Aksi</th>
                <th className="w-10 border border-gray-300"></th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) =>
                product.categories.map((category, categoryIndex) => (
                  <tr key={category.id}>
                    {categoryIndex === 0 && (
                      <>
                        <td className="border border-gray-300 p-3 text-center" rowSpan={product.categories.length}>
                          {product.id}.
                        </td>
                        <td className="border border-gray-300 p-3" rowSpan={product.categories.length}>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProductName(product.id, e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded"
                            placeholder="Nama produk"
                          />
                        </td>
                      </>
                    )}
                    <td className="border border-gray-300 p-3">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategoryName(product.id, category.id, e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                          placeholder="Deskripsi kategori"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3 relative">
                      <div className="flex justify-center items-center h-24 bg-gray-100">
                        {category.image ? (
                          <img
                            src={category.image || "/placeholder.svg"}
                            width={60}
                            height={80}
                            alt={category.name || "Product image"}
                            className="object-contain h-20"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm">Belum ada gambar</div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <button
                          className="bg-white p-1 rounded border border-gray-300"
                          onClick={() => triggerFileInput(product.id, category.id)}
                        >
                          <Upload size={16} className="text-gray-700" />
                        </button>
                        {category.image && (
                          <button
                            className="bg-white p-1 rounded border border-gray-300"
                            onClick={() => openDeleteImageDialog(product.id, category.id)}
                          >
                            <Trash2 size={16} className="text-gray-700" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="flex justify-center">
                        <button className="p-1 text-gray-700" onClick={() => deleteCategory(product.id, category.id)}>
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                    {categoryIndex === 0 && (
                      <>
                        <td className="p-3 border-r border-gray-300" rowSpan={product.categories.length}>
                          <button className="p-1 text-gray-700" onClick={() => deleteProduct(product.id)}>
                            <X size={18} />
                          </button>
                        </td>
                        <td className="p-3" rowSpan={product.categories.length}>
                          {product.categories.length < 3 && (
                            <button
                              className="p-1 bg-white border border-gray-300 rounded"
                              onClick={() => addCategory(product.id)}
                            >
                              <Plus size={18} className="text-gray-700" />
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                )),
              )}
            </tbody>
          </table>

          <div className="flex justify-end p-2 border-t border-gray-300">
            {products.length < 5 && (
              <button className="p-1 bg-white border border-gray-300 rounded" onClick={addProduct}>
                <Plus size={18} className="text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png" onChange={handleImageUpload} />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apakah Anda Yakin untuk Menghapus Gambar?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="bg-[#808080] text-white hover:bg-[#707070]"
            >
              Batalkan
            </Button>
            <Button onClick={deleteImage} className="bg-[#D22B2B] text-white hover:bg-[#B22222]">
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

