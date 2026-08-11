export interface ImgBbResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string; // url principal da imagem
    display_url: string;
    width: string;
    height: string;
    size: number;
    time: string;
    expiration: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

