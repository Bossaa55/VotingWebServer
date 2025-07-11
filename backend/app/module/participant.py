
class Participant:
    def __init__(self, name: str, image: str = ""):
        self.name = name
        self.image = image

    def to_dict(self):
        return {
            "name": self.name,
            "image": self.image
        }

    @classmethod
    def from_dict(cls, data: dict):
        return cls(name=data.get("name", ""), image=data.get("image", ""))