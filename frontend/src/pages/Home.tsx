import {
  Card,
  CardContent,
  Checkbox,
  Container,
  Grid2,
  Typography,
} from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" sx={{ margin: "5px" }}>
        Test
      </Typography>
      <Grid2 container spacing={3}>
        <Card style={{ cursor: "pointer", position: "relative" }}>
          <CardContent>
            <img
              src="https://cdn.wccftech.com/wp-content/uploads/2017/05/subtitle-of-a-blu-ray-movie.jpg"
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                padding: "2px",
              }}
            />
            <Checkbox
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                zIndex: 1000,
                backgroundColor: "white",
              }}
            />
          </CardContent>
        </Card>
        <Card style={{ cursor: "pointer", position: "relative" }}>
          <CardContent>
            <img
              src="https://thumbs.dreamstime.com/b/house-white-picket-fence-urban-setting-40234151.jpg"
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                padding: "2px",
              }}
            />
            <Checkbox
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                zIndex: 1000,
                backgroundColor: "white",
              }}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Container>
  );
}
