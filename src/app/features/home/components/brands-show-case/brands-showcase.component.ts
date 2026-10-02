import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Brand {
  name: string;
  logo: string;
  productCount: string;
  brandParam: string;
  isIris?: boolean;
}

@Component({
  selector: 'app-brands-showcase',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brands-showcase.component.html',
})
export class BrandsShowcaseComponent {
  readonly brands: Brand[] = [
    {
      name: 'IRIS Computer',
      logo: '/logo/iris.jpeg',
      productCount: 'Tu tienda de confianza',
      brandParam: 'Iris',
      isIris: true,
    },
    {
      name: 'Corsair',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Corsair.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
      productCount: '+3 productos',
      brandParam: 'Corsair',
    },
    {
      name: 'AMD',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/250px-AMD_Logo.svg.png',
      productCount: '+5 productos',
      brandParam: 'AMD',
    },
    {
      name: 'ASUS',
      logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87_Asus_White.png/120px-%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87_Asus_White.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20220507060342',
      productCount: '+6 productos',
      brandParam: 'ASUS',
    },
    {
      name: 'Samsung',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Samsung_logo_wordmark.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
      productCount: '+2 productos',
      brandParam: 'Samsung',
    },
  ];
}
