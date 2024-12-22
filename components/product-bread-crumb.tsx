import { ProductQueryResult } from "@/sanity.types";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { AllProductConfigs } from "@/config/product";

interface ProductBreadCrumbProps {
  lang: string;
  product: ProductQueryResult;
}

export default function ProductBreadCrumb({ lang, product }: ProductBreadCrumbProps) {
  const productConfig = AllProductConfigs[lang];

  return <Breadcrumb className="">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/${lang}/group/new`}>
          {productConfig.title}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href={`/${lang}/group/${product?.category?.group?.slug}`}>
          {product?.category?.group?.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href={`/${lang}/group/${product?.category?.group?.slug}/category/${product?.category?.slug}`}>
          {product?.category?.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="font-medium">
          {product?.name}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>;
}